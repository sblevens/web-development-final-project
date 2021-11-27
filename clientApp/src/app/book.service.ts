import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Book} from './model/book';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getBooks(){
    return this.http.get('http://localhost:8080/books');
  }

  getBookDetail(id: string){
    console.log(id);
    return this.http.get('http://localhost:8080/bookdetail/'+id);
  }

  //post a new book
  postBook(b: Book){

  }

  //post a rating for a given book
  postRating(b: Book, r:string){

  }




}
