import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
})
export class FormatPricePipe implements PipeTransform {
  transform(value: number): string {
    return value > 1 ? value.toFixed(2) : value.toPrecision(2);
  }
}
