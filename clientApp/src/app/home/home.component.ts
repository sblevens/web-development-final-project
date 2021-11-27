import { Component, OnInit } from '@angular/core';
import { SearchBooksPipe } from '../pipes/search-books.pipe';
import {BookService} from '../book.service';
import {Book} from '../model/book';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private bservice: BookService) { 
    // this.adding_review = false;
    this.books = [];
    this.getBooks();
  }

  ngOnInit(): void {
    this.sortRating();
  }

  new_id: number = 8;
  search_book: string = '';
  search_author: string = '';
  adding_review = false;
  book_name: string = '';
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
    console.log(this.adding_review);
  }

  onSubmit() {
    let book = {id: this.new_id, name: this.book_name, author: this.book_author, rating: this.book_rating, favorited: this.book_favorited};
    this.books.push(book);
    this.new_id = this.new_id + 1;
    this.book_name = '';
    this.book_author = '';
    this.book_rating = 1;
    this.book_review = '';
    this.adding_review = false;
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
