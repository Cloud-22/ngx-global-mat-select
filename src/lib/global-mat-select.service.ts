import {ChangeDetectorRef, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {GlobalMatSelectOptionsInterface} from "./models/globalMatSelectOptions.Interface";
import {GlobalMatSelectConfig} from "./models/globalMatSelectConfig.interface";
import {BehaviorSubject, Observable} from "rxjs";
import {scan} from "rxjs/operators";

@Injectable({
  providedIn: null
})
export class GlobalMatSelectService {

  private _searchConfig: BehaviorSubject<GlobalMatSelectConfig> = new BehaviorSubject<GlobalMatSelectConfig>(null);
  private _selectOptions: BehaviorSubject<GlobalMatSelectOptionsInterface[]> = new BehaviorSubject<GlobalMatSelectOptionsInterface[]>([])
  private _originalSelectOptions: BehaviorSubject<GlobalMatSelectOptionsInterface[]> = new BehaviorSubject<GlobalMatSelectOptionsInterface[]>([]);


  selectOptions$: Observable<GlobalMatSelectOptionsInterface[]> = this._selectOptions.asObservable()
  //   .pipe(
  //   scan((acc, curr) => {
  //     return [...acc, ...curr];
  //   }, [])
  // );

  constructor(
    private httpClient: HttpClient
  ) { }

  set searchConfig(newSearchConfig){
    this._searchConfig.next(newSearchConfig);
  }

  get searchConfig(){
    return this._searchConfig.getValue();
  }

  set originalSelectOptions(newSelectOptions: GlobalMatSelectOptionsInterface[]){
    this._originalSelectOptions.next(newSelectOptions);
  }

  get originalSelectOptions(): GlobalMatSelectOptionsInterface[] {
    return this._originalSelectOptions.getValue();
  }

  getSelectOptions(): Observable<GlobalMatSelectOptionsInterface[]> {
    return this._selectOptions.asObservable();
  }

  setSelectOptions(options:GlobalMatSelectOptionsInterface[]) {
    this._selectOptions.next(options);
  }


  applyLocalSearch(query: string): void {
    if (query && query != ""){
      this.setSelectOptions(this._selectOptions.value.filter(option => option.text.includes(query)));
    } else
      this.setSelectOptions(this.originalSelectOptions);
  }

  async applyLiveSearch(query: string) {
    let response: any;
    let completedSearchQuery: string;

    if (query && query != ""){
      if (this.searchConfig.liveSearchConfig && this.searchConfig.liveSearchConfig.isQueryStringSearch){
        let queryStringParams: HttpParams = new HttpParams();
        response = await this.httpClient.get(
          this.searchConfig.liveSearchConfig.liveSearchURL,
          {params: queryStringParams.set(this.searchConfig.liveSearchConfig.queryConfig.queryString, query)}
        ).toPromise();
      } else if (this.searchConfig.liveSearchConfig && this.searchConfig.liveSearchConfig.isHeaderSearch){
        let httpHeaders: HttpHeaders = new HttpHeaders();
        response = await this.httpClient.get(this.searchConfig.liveSearchConfig.liveSearchURL,
          {headers: httpHeaders.set(this.searchConfig.liveSearchConfig.headerConfig.headersString, query)}
        ).toPromise();
      } else {
        // Regular URL search using URL Variable
        if (this.searchConfig.liveSearchConfig.liveSearchURL.substr(-1) != '/')
          this.searchConfig.liveSearchConfig.liveSearchURL += '/';
        response = await this.httpClient.get(`${this.searchConfig.liveSearchConfig.liveSearchURL}${query}`);
      }
      // Apply Mapping Func
      this.setSelectOptions(this.searchConfig.liveSearchConfig.liveResultMappingFunc(response) as GlobalMatSelectOptionsInterface[]);
    }
      else
        this.setSelectOptions(this.originalSelectOptions);
   }


}
