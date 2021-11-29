import { Component, OnInit } from '@angular/core';
import { SearchBooksPipe } from '../pipes/search-books.pipe';
import {BookService} from '../book.service';
import {Book} from '../model/book';
import { BookDetail } from '../model/bookDetail';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private bservice: BookService, private router: Router) { 
    // this.adding_review = false;
    this.books = [];
    this.getBooks();
  }

  ngOnInit(): void {
    this.user = this.bservice.getUser();
    if(!this.user){
      this.router.navigateByUrl('/login');
    }
    this.sortRating();
  }

  user: string = '';
  search_book: string = '';
  search_author: string = '';
  adding_review = false;
  adding_book = false;
  book_name: string = '';
  book_name1: string = '';
  book_author: string = '';
  book_rating: number = 1;
  book_review: string = '';
  book_favorited: boolean = false;
  sort_ascending: boolean = false;
  sort_favorited: boolean = false;
  books: Book[];
  
  getBooks(){
    this.bservice.getBooks().subscribe((result: any) => {
      this.books = result;
      console.log("assign b: " + result);
      console.log(JSON.stringify(result));
    });
  }

  toggleShow(){
    this.adding_review = !this.adding_review;
  }

  addReview() {
    console.log("test");
    this.adding_review = true;
    this.adding_book = false;
    console.log(this.adding_review);
  }

  addBook(){
    this.adding_book = true;
    this.adding_review = false;

  }

  onSubmit() {
    var book: BookDetail;
    book = {book_name: this.book_name, rating: this.book_rating, review: this.book_review, review_author: this.bservice.getUser()};
    this.bservice.postRating(book).subscribe((result:any)=>{
      console.log(result);
    })
    //this.books.push(book);
    this.book_name = '';
    this.book_author = '';
    this.book_rating = 1;
    this.book_review = '';
    this.adding_review = false;
  }

  onSubmitBook(){
    var book: Book;
    book = {name: this.book_name1, author: this.book_author, favorited: false}
    this.bservice.postBook(book).subscribe((result:any)=>{
      console.log(result);
      this.getBooks();
    });

    this.book_name1 = '';
    this.book_author = '';
    this.adding_book = false;
  }

  sortRating(){
    if(this.sort_ascending){
      this.books.sort((a,b) => {
        if(a.rating && b.rating){
          if(a.rating > b.rating){
            return 1;
          }
          if(a.rating < b.rating){
            return -1;
          }
        }
        return 0;
      });
    } else {
      this.books.sort((a,b) => {
        if(a.rating && b.rating){
          if(a.rating < b.rating){
            return 1;
          }
          if(a.rating > b.rating){
            return -1;
          }
        }
        return 0;
      });
    }
    this.sort_ascending = !this.sort_ascending;
    
    
  }

  sortFavorited(){
    if(this.sort_favorited){
      this.books.sort((a,b)=>{
        if(a.favorited > b.favorited){
          return 1;
        }
        if(a.favorited < b.favorited){
          return -1;
        }
        return 0;
      });
    } else {
      this.books.sort((a,b)=>{
        if(a.favorited < b.favorited){
          return 1;
        }
        if(a.favorited > b.favorited){
          return -1;
        }
        return 0;
      });
    }
    this.sort_favorited = !this.sort_favorited;
  }

  

}
