import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';

const materialModules = [
  CdkTreeModule,
  MatIconModule,
  MatTreeModule,
  MatButtonModule,
  MatExpansionModule,
  MatCardModule
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  exports: [
    ...materialModules
  ],
})

export class AngularMaterialModule { }