import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
