import { GlobalMatSelectOptionsInterface } from "./globalMatSelectOptions.Interface";

export interface GlobalMatSelectLiveSearchConfigInterface {
  /**
   * @description URL used to execute server side search
   */
  liveSearchURL: string;

  /**
   * @description enable QueryString search
   */
  isQueryStringSearch: boolean;

  /**
   * @description querySearch Config, Must be fulfilled if isQueryStringSearch == True
   */
  queryConfig?: {queryString: string,}

  /**
   * @description enable Header search,
   */
  isHeaderSearch: boolean;


  /**
   * @description /....
   */
  headerConfig?: {headersString: string}



  /**
   * @param res<any> Response from the liveSearchURL API
   * @description Mapping function used to map the API response to OptionsInterface Array
   */
  liveResultMappingFunc(res): GlobalMatSelectOptionsInterface[];




}
