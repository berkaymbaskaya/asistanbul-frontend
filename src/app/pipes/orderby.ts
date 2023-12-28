// orderby.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    array.sort((a: any, b: any) => {
      // Aşağıdaki satır sayısal değerlere göre sıralama yapar.
      return a[field] - b[field];
    });

    return array;
  }
}
