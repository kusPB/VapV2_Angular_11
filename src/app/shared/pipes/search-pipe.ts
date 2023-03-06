import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], field: any, value: string): any[] {

    if (!items) {
      return [];
    }
    if (!value) {
      return items;
    }

    const filtered: any[] = [];
    const newQuery = value.toLowerCase().split(' ');

    items.forEach((element: any) => {
      if (element) {
        let col = '';
        field.forEach(x => {
          if (element[x.field]) {
            col += ' ' + element[x.field];
          }
        });
        element.col = col;
      }
    });

    newQuery.forEach((element: any, index) => {
      if (element !== '') {
        filtered[index] = ([...items].filter(x => x.col.toLowerCase().includes(element.toLowerCase())).map(x => x));
      }
    });
    const arr = Object.values(filtered);
    const res = arr[0].filter(v => arr.slice(1).every(a => a.includes(v)));
    return res;
  }

}
