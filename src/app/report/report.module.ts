import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe, DecimalPipe } from '@angular/common';
import { ReportLabourCostComponent } from './components';



@NgModule({
  declarations: [
    ReportLabourCostComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReportLabourCostComponent
  ],
  providers: [
    PercentPipe,
    DecimalPipe
  ]
})
export class ReportModule { }
