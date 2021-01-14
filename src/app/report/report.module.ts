import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe, DecimalPipe } from '@angular/common';
import { ReportLabourCostComponent } from './components';
import { CurrencySymbolPipe } from './pipes/currency-symbol.pipe';



@NgModule({
  declarations: [
    ReportLabourCostComponent,
    CurrencySymbolPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReportLabourCostComponent
  ],
  providers: [
    PercentPipe,
    DecimalPipe,
    CurrencySymbolPipe
  ]
})
export class ReportModule { }
