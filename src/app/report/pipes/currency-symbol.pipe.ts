import { Pipe, PipeTransform } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {

  transform(code: string = 'GBP', format: 'wide' | 'narrow' = 'narrow'): string {
    return getCurrencySymbol(code, format);
  }

}
