import { GlobalMatSelectOptionsInterface } from "./globalMatSelectOptions.Interface";
import { GlobalMatSelectLiveSearchConfigInterface } from "./globalMatSelectLiveSearchConfigInterface";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {scan} from "rxjs/operators";

export class GlobalMatSelectConfig {

  // private _selectOptions: BehaviorSubject<GlobalMatSelectOptionsInterface[]> = new BehaviorSubject<GlobalMatSelectOptionsInterface[]>([])
  //
  //
  // selectOptions: Observable<GlobalMatSelectOptionsInterface[]>;
  //
  // constructor(
  //   private httpClient: HttpClient
  // ) {
  //   this.selectOptions = this._selectOptions.asObservable().pipe(
  //     scan((acc, curr) => {
  //       return [...acc, ...curr];
  //     }, [])
  //   );
  // }
  //
  // updateOptions(options: GlobalMatSelectOptionsInterface[]) {
  //   this._selectOptions.next(options);
  // }


  /**
   * @description Array of available options to select
   */
  // options: GlobalMatSelectOptionsInterface[];

  /**
   * @description label value to view above the select input
   */
  label?: string;

  /**
   * @description Placeholder value to view in the select input
   */
  placeholder?: string;

  /**
   * @description Placeholder value to view in the search input
   */
  searchPlaceHolder?: string;

  /**
   * @description enable multi-options select
   */
  enableMultiSelect: boolean;

  /**
   * @description Configuration to apply live search, using queryString:
   *              ?queryString=searchValue
   *              OR
   *              using URL variable URL/`${searchQuery}`
   */
  liveSearchConfig?: GlobalMatSelectLiveSearchConfigInterface;

  /**
   * @description enable Live-search to an external API
   */
  enableLiveSearch: boolean;

  /**
   * @description enable local-search
   */
  enableLocalSearch: boolean;


  // /**
  //  * enable Infinite scroll through all available options and get more when necessary
  //  */
  // public enableInfiniteOptionsScroll: boolean = false;

  /**
   * Used to stop Infinite scroll Event emitting if _options.length == totalOptionsLength
   */
  totalOptionsLength: number;

}
