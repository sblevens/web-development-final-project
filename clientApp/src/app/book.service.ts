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

  getBooks(user: string){
    return this.http.get('http://localhost:8080/books/'+user);
  }

  getBookDetail(user: string, id:string){
    console.log(id);
    return this.http.get('http://localhost:8080/bookdetail/'+user+"/"+id);
  }

  getReviews(user: string){
    console.log("get reviews for " + user);
    return this.http.get('http://localhost:8080/reviews/'+user);
  }

  getAvgReviews(name: string){
    // console.log('getting ratings from book service' )
    return this.http.get('http://localhost:8080/avg_reviews/'+name);
  }

  getToBeRead(user: string){
    console.log("get to be read list for " + user);
    return this.http.get('http://localhost:8080/toberead/'+user);
    
  }

  toggleFavorite(fav: boolean, user: string, name: string){
    let body = new URLSearchParams();
    let f;
    if(fav){
      f = "true";
    } else {
      f = "false";
    }
    body.set('fav',f);
    body.set('user',user);
    body.set('name',name);
    let options: Object = {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    return this.http.put('http://localhost:8080/updateFavorites',body,options)
  }

  toggleToBeRead(toBeRead: boolean, user: string, name: string){
    let body = new URLSearchParams();
    let r;
    if(toBeRead)
      r = "true";
    else
      r = "false";
    body.set('toBeRead',r);
    body.set('user',user);
    body.set('name',name);
    console.log("body:");
    console.log(body);
    
    let options: Object = {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
    }
    return this.http.put('http://localhost:8080/updateToBeRead',body,options);
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

  logout(){
    this.username = '';
    return this.http.get('http://localhost:8080/logout');
  }


  register(user: string, pass:string){
    console.log(user + " " + pass);
    let body = new URLSearchParams();
    body.set('user',user);
    body.set('pass',pass);
    let options: Object = {
      headers: new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded'),
      // responseType: "text"

    };
    return this.http.post('http://localhost:8080/register',body.toString(),options);
  }

  verifyLogin(){
    return this.http.get('http://localhost:8080/');
  }


}
