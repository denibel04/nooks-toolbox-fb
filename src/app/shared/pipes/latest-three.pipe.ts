import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'latestThree'
})
export class LatestThreePipe implements PipeTransform {
  /**
   * Transforms an array of items to return the latest three based on their `createdAt` property.
   * @param items The array of items to be transformed.
   * @returns The sorted array containing the latest three items.
   */
  transform(items: any[]): any[] {
    if (!items) {
      return [];
    }
    return items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  }

}
