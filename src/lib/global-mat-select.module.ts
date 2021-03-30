import { NgModule } from '@angular/core';
import { GlobalMatSelectComponent } from './global-mat-select.component';
import { CommonModule } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "./material/material.module";
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {HttpClientModule} from "@angular/common/http";
import {MatSelectInfiniteScrollModule} from "ng-mat-select-infinite-scroll";



@NgModule({
  declarations: [GlobalMatSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxMatSelectSearchModule,
        MatSelectInfiniteScrollModule
    ],
  exports: [GlobalMatSelectComponent]
})
export class GlobalMatSelectModule { }
