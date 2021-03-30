# GlobalMatSelect
![npm](https://img.shields.io/npm/dw/ngx-global-mat-select)
![npm](https://img.shields.io/npm/v/ngx-global-mat-select)

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.6.

## What does it do ?
This package aims to add extra features to [Angular Material Select component](https://material.angular.io/components/select)
through combining multiple functionalities from Angular Material, ngx-mat-select-search and ng-mat-select-infinite-scroll.
to provide the following easy-to-configure features:

- Local filtering through available options
- Server side options filtering (Live Search) through HTTP requests
- Supporting infinite scroll to load long lists of options
- Full compatibility with Material Form Field Component   `<mat-form-field>`



## How to use it in your project

Install `npm i global-mat-search` 


then import `GlobalMatSelectModule` in `app.module.ts`


```TypeScript
import {NgModule} from "@angular/core";
import {GlobalMatSelectModule} from "ngx-global-mat-select";

@NgModule({
  declarations: [  ],
  imports: [
    GlobalMatSelectModule,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
```

In the template use selector 

```html
<global-mat-select 
                    [options]="options"
                    [config]="cfg"
                    [formControl]="..."
                    (infiniteScrollLimit)="getNewOptionsAndPushToOptionsArr()"
></global-mat-select>
```

With the following Inputs


## Options Input
| Property          | Type                                      | Description                                    | Required  | Notes
| -----------       | -----------------------------------       | ---------------------------------------------- | --------- | ------
|options            | GlobalMatSelectOptionsInterface[]         | Array of available options to select from      | True      | 



## Config Input
The config object should be of type `GlobalMatSelectConfig` and implements the following props


| Property          | Type                                      | Description                                                                                                                   | Required  | Notes
| -----------       | -----------------------------------       | ----------------------------------------------                                                                                | --------- | ------
|label              | string                                    | Label value to view above the select input                                                                                    | False     |
|placeholder        | string                                    | Placeholder value to view in the select input                                                                                 | False     |    
|searchPlaceHolder  | string                                    | Placeholder value to view in the search input                                                                                 | False     |
|enableMultiSelect  | boolean                                   | Enable multi-options select                                                                                                   | True      |
|liveSearchConfig   | GlobalMatSelectLiveSearchConfigInterface  | Configuration to apply live search                                                                                            | False     |
|enableLiveSearch   | boolean                                   | Enable Live-search to an external API                                                                                         | True      |
|enableLocalSearch  | boolean                                   | Enable Local-search                                                                                                           | True      | One type of search should be explicitly true
|totalOptionsLength | number                                    | Used to stop Infinite scroll Event emitting if ```totalOptionsLength <= options.length``` (Reached the end of available data  | False     | The pagination event wont emit if the user is searching for options using Local or Live search 


 
### Interfaces
- `GlobalMatSelectOptionsInterface` used to force all options to have the following props
```
{
    text: string
    value: any
}
``` 


- `GlobalMatSelectLiveSearchConfigInterface`   used to config server side options filtering, should implement the following props
```
{
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
       * @description enable Header search, else regular URL variable search
       */
      isHeaderSearch: boolean;
    
      /**
       * @description headerSearch Config, Must be fulfilled if isHeaderStringSearch == True
       */
      headerConfig?: {headersString: string}
   
      /**
       * @param res<any> Response from the liveSearchURL API
       * @description Mapping function used to map the API response to OptionsInterface Array
       */
      liveResultMappingFunc(res): GlobalMatSelectOptionsInterface[];

}
```


#### Example of using `liveResultMappingFunc` 

```js
 liveResultMappingFunc(data: any): GlobalMatSelectOptionsInterface[] {
              return (data as Array<any>).map(item => ({value: item.id, text: item.title}));
}

```



Run `ng build global-mat-select` to build the project. The build artifacts will be stored in the `dist/` directory.


#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
