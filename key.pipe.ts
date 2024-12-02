import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
  standalone: true,
})
export class KeyPipe implements PipeTransform {
  transform(value: any): any[] {
    if (value && typeof value === 'object') {
      return Object.keys(value);
    }
    return [];
  }
}
