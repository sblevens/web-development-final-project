import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBooks'
})
export class SearchBooksPipe implements PipeTransform {

  transform(books: any[], value: string) {
    if(!value)
      return books;
    if(!books){
      return null
    }
    return books ? books.filter(book => book.name.toLowerCase().includes(value.toLowerCase())): [];
  }

}
