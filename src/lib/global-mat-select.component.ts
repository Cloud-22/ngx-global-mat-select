import {
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter,
  forwardRef,
  HostBinding,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Optional, Output,
  Self, SimpleChanges, ViewChild,
} from '@angular/core';
import {GlobalMatSelectConfig} from "./models/globalMatSelectConfig.interface";
import {ControlValueAccessor, FormControl, NgControl} from "@angular/forms";
import {GlobalMatSelectService} from "./global-mat-select.service";
import {Subject, Subscription} from "rxjs";
import {GlobalMatSelectOptionsInterface} from "./models/globalMatSelectOptions.Interface";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {MatFormFieldControl} from "@angular/material/form-field";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {MatSelect} from "@angular/material/select";


@Component({
  selector: 'global-mat-select[options][config]',
  template: `
    <ng-container *ngIf="selectConfig">
      <div class="global-mat-select-container">
        <mat-label>{{ selectConfig.label }}</mat-label>
        <mat-select [(ngModel)]="selectedValue"
                    [disabled]="_isDisabled"
                    [placeholder]="selectConfig.placeholder"
                    [multiple]="selectConfig.enableMultiSelect"
                    (infiniteScroll)="emitOuterInfiniteScrollEvent()"
                    [complete]="selectConfig?.totalOptionsLength <= (globalMatSearchService.selectOptions$ | async)?.length"
                    msInfiniteScroll
                    class="global-mat-select-input"
                    #mat_select
        >


          <mat-option>
            <ngx-mat-select-search
              [formControl]="optionsSearchCtrl"
              [disabled]="(selectConfig.enableLiveSearch || selectConfig.enableLocalSearch)"
              [placeholderLabel]="selectConfig.searchPlaceHolder"
              [noEntriesFoundLabel]="'No Records Found'"
              [searching]="isLiveSearchingInProgress"
              #singleSearch
            ></ngx-mat-select-search>
          </mat-option>


          <mat-option *ngFor="let option of globalMatSearchService.selectOptions$ | async"
                      [value]="option.value"
          >
            {{ option.text }}
          </mat-option>
        </mat-select>
      </div>
    </ng-container>
  `,
  styles: [`
    .mat-form-field-type-global-mat-select:not(.mat-form-field-should-float) .mat-form-field-label-wrapper > .mat-form-field-label {
      margin-top: 2.5rem;
      padding: .5em;
    }
  `
  ],
  providers: [{
    provide: MatFormFieldControl, useExisting: GlobalMatSelectComponent
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => GlobalMatSearchComponent),
    //   multi: true
  },
    GlobalMatSelectService
  ],
})
export class GlobalMatSelectComponent implements OnInit, ControlValueAccessor, MatFormFieldControl<any>, OnChanges, OnDestroy {

  static nextId = 0;

  private _selectConfig: GlobalMatSelectConfig;
  private _selectedValue: any = null;
  public _isDisabled: boolean = false;


  public optionsSearchCtrl: FormControl = new FormControl();
  private _searchCtrlSubscription: Subscription;
  private _ngFormControlErrorStatusSubscription: Subscription;

  @ViewChild('mat_select') private matSelectElement: MatSelect;

  @ViewChild('singleSearch', {static: false}) singleSearch;

  @Output('infiniteScrollLimit') public outerInfiniteScrollEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Input('config')
  public set selectConfig(value: GlobalMatSelectConfig) {
    if (value) {
      this._selectConfig = value as GlobalMatSelectConfig;
      this.globalMatSearchService.searchConfig = value as GlobalMatSelectConfig;
    }
    this.cdr.markForCheck();
  };

  @Input('options')
  public set updateSelectOptions(options: GlobalMatSelectOptionsInterface[]) {
    if (options) {

      // To avoid viewchild undefined query results
      if (this.singleSearch){
        this.singleSearch.disableScrollToActiveOnOptionsChanged = true;

        this.globalMatSearchService.setSelectOptions(options as GlobalMatSelectOptionsInterface[]);


        setTimeout(() => {
          this.singleSearch.disableScrollToActiveOnOptionsChanged = false;
        }, 2000);
      } else {
        this.globalMatSearchService.setSelectOptions(options as GlobalMatSelectOptionsInterface[]);
      }

      if (this.globalMatSearchService.originalSelectOptions.length == 0) {
        this.globalMatSearchService.originalSelectOptions = options;
      }

    }
  };

  public get selectConfig(): GlobalMatSelectConfig {
    return this._selectConfig;
  }


  public set selectedValue(value) {
    if (value !== undefined && this.selectedValue !== value && !this._isDisabled) {
      this._selectedValue = value;
      this.onChange(value);
    }
  }

  public get selectedValue() {
    return this._selectedValue;
  }

  isLiveSearchingInProgress: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    public globalMatSearchService: GlobalMatSelectService,
    @Optional() @Self() public ngControl: NgControl,
  ) {

    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

  }


  ngOnInit(): void {
    this._searchCtrlSubscription = this.subscribeToSearchQueries();
    this._ngFormControlErrorStatusSubscription = this.ngControl.statusChanges.subscribe(controlStatue => {
      try {
        if (controlStatue.toString().toLowerCase() != 'valid')
          this.errorState = true;
      } catch (e) {
        this._errorState = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }


  subscribeToSearchQueries(): Subscription {
    return this.optionsSearchCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(async (value) => {
      if (this.globalMatSearchService.searchConfig.enableLocalSearch)
        this.globalMatSearchService.applyLocalSearch(value);
      else if (this.globalMatSearchService.searchConfig.enableLiveSearch) {
        this.isLiveSearchingInProgress = true;
        await this.globalMatSearchService.applyLiveSearch(value);
        this.isLiveSearchingInProgress = false;
      }
      this.cdr.detectChanges();
    })
  }

  /**
   * Emit an event to get more data on scroll, the search input field value will be emitted if needed in data fetching ...
   */
  emitOuterInfiniteScrollEvent(): void {
    if (!this.optionsSearchCtrl.value || this.optionsSearchCtrl.value == ""
        || (Array.isArray(this.optionsSearchCtrl.value) && this.optionsSearchCtrl.value.length == 0))
      this.outerInfiniteScrollEventEmitter.emit();
  }


  /**
   =========================================================
   =          Mat Form Field Control Implementation        =
   =========================================================
   */

  private _placeholder: string;

  @Input() get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh.toString();
    this.stateChanges.next();
  }


  set value(selectedValue) {
    this.stateChanges.next()
  }

  stateChanges: Subject<void> = new Subject<void>();

  //
  get empty() {
    return !this.selectedValue;
  }

  focused: boolean = false;

  @HostBinding() id: string = `global-mat-search-${GlobalMatSelectComponent.nextId++}`;


  readonly autofilled: boolean;
  readonly controlType: string = 'global-mat-select';


  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      // this.elRef.nativeElement.querySelector('input').focus();
      this.matSelectElement.open()
    }
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _required: boolean = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _errorState = false;

  get errorState() {
    return this._errorState;
  }

  set errorState(value) {
    this._errorState = value;
  }


  @Input('aria-describedby') userAriaDescribedBy: string;

  setDescribedByIds(ids: string[]): void {
    // TBI
  }


  /**
   =========================================================
   =          Control Value Accessor Implementation        =
   =========================================================
   */

  onChange = (value: any) => {
  };

  onTouched = () => {
  };

  writeValue(value: any): void {
    this._selectedValue = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (newValue: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }


  ngOnDestroy() {
    this._searchCtrlSubscription.unsubscribe();
    this._ngFormControlErrorStatusSubscription.unsubscribe();
  }
}
