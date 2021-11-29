import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Book} from './model/book';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  username: string = '';

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

  login(user: string, pass: string){
    console.log(user + " " + pass);
    let body = new URLSearchParams();
    body.set('user',user);
    body.set('pass',pass);
    let options: Object = {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'),
      // responseType: "text"

    };
    return this.http.post('http://localhost:8080/login',body.toString(),options);
  }

  setUser(user:string){
    this.username = user;
    console.log("set user");
    
  }

  register(user: string, pass:string){
    
  }

  verifyLogin(){
    return this.http.get('http://localhost:8080/');
  }


}
