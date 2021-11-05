import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBooks'
})
export class SearchBooksPipe implements PipeTransform {

  transform(books: any[], name: string, author: string) {
    if(!name && !author)
      return books;
    if(!books){
      return null
    }
    return books ? books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()) && book.author.toLowerCase().includes(author.toLowerCase())): [];
  }

}
