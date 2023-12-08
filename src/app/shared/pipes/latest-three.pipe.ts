import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'latestThree'
})
export class LatestThreePipe implements PipeTransform {

  transform(items: any[]): any[] {
    if (!items) {
      return [];
    }
    return items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  }

}
