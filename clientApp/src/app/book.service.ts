import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Book} from './model/book';
import {map} from 'rxjs/operators';
import { BookDetail } from './model/bookDetail';
import { UrlResolver } from '@angular/compiler';

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

  getReviews(user: string){
    console.log("get reviews for " + user);
    return this.http.get('http://localhost:8080/reviews/'+user);
  }

  //post a new book
  postBook(b: Book){
    console.log("posting new book");
    console.log(b);
    
    let body = new URLSearchParams();
    body.set('name',b.name);
    body.set('author',b.author);
    let options: Object = {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    return this.http.post('http://localhost:8080/postBook',body.toString(), options);
  }

  //post a rating for a given book
  postRating(b: BookDetail){
    console.log("posting new review");
    let body = new URLSearchParams();
    body.set('book_name',b.book_name);
    body.set('review',b.review);
    body.set('rating',b.rating.toString());
    body.set('review_author',b.review_author);
    let options: Object = {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    return this.http.post('http://localhost:8080/postReview',body.toString(),options);
    
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
  getUser(){
    return this.username;
  }

  register(user: string, pass:string){
    
  }

  verifyLogin(){
    return this.http.get('http://localhost:8080/');
  }


}
