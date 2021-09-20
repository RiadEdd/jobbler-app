import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 59) return 'Just now';

      const intervalsMap = new Map([
        ['year', 31536000],
        ['month', 2592000],
        ['week', 604800],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1],
      ]);

      let counter;
      for (let intervalEntry of intervalsMap.entries()) {
        counter = Math.floor(seconds / intervalEntry[1]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + intervalEntry[0] + ' ago';
          } else {
            return counter + ' ' + intervalEntry[0] + 's ago';
          }
      }
    }
    return value;
  }
}
