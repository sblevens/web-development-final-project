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
    this.all_ratings = [];
  }

  ngOnInit(): void {
    this.user = this.bservice.getUser();
    if(!this.user){
      this.router.navigateByUrl('/login');
    }
    this.getBooks();
    this.sortRating();
  }

  user: string = '';
  search_book: string = '';
  search_author: string = '';
  adding_review = false;
  adding_book = false;
  book_name: string = '';
  public book_name1: string = '';
  book_author: string = '';
  book_rating: number = 1;
  book_review: string = '';
  book_favorited: boolean = false;
  sort_ascending: boolean = false;
  sort_favorited: boolean = false;
  books: Book[];
  all_ratings: number[];
  avg_ratings: number = 0;
  display_error: string = '';
  
  getBooks(){
    this.bservice.getBooks(this.user).subscribe((result: any) => {
      this.books = result;
      for(let [i,book] of this.books.entries()){
        this.getAvgReviews(book.name).subscribe((result:any)=>{
          for(let r of result){
            this.all_ratings.push(parseInt(r.rating));
          }
          if(this.all_ratings.length!=0){
            var ratings = this.all_ratings.reduce((a,b)=> a + b);
            this.avg_ratings = (ratings/this.all_ratings.length) || 0;
            this.books[i].rating = Math.ceil(this.avg_ratings);
            
          } else {
            this.book_rating = 0;
          }
          this.all_ratings = [];
        });
      }
    });
  }

  getAvgReviews(book_name: string){
    return this.bservice.getAvgReviews(book_name)
  }

  toggleShow(){
    this.adding_review = !this.adding_review;
  }

  addReview() {
    document.getElementById('add_review_modal')!.style.display='block'
    console.log("test");
    this.adding_review = true;
    this.adding_book = false;
    console.log(this.adding_review);
  }

  addBook(){
    document.getElementById('add_book_modal')!.style.display='block';
    this.adding_book = true;
    this.adding_review = false;

  }

  onSubmit() {
    var book: BookDetail;
    book = {book_name: this.book_name, rating: this.book_rating, review: this.book_review, review_author: this.bservice.getUser()};
    this.bservice.postRating(book).subscribe((result:any)=>{
      console.log(result);
      if(result["errors"]){
        this.display_error = 'There was an error submitting the review.';
      }
    })
    //this.books.push(book);
    this.book_name = '';
    this.book_author = '';
    this.book_rating = 1;
    this.book_review = '';
    this.adding_review = false;
    document.getElementById('add_review_modal')!.style.display='none';
    this.getBooks();
  }

  onSubmitBook(){
    var book: Book;
    book = {name: this.book_name1, author: this.book_author, favorited: false, toBeRead: false}
    this.bservice.postBook(book).subscribe((result:any)=>{
      console.log(result);
      if(result["errors"]){
        this.display_error = 'There was an error submitting the book.';
      }
      this.getBooks();
    });

    this.book_name1 = '';
    this.book_author = '';
    this.adding_book = false;
    document.getElementById('add_book_modal')!.style.display='none';
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
    console.log("sorting");
    
    if(this.sort_favorited){
      this.books.sort((a,b)=>{
        console.log(a.favorited + " vs " + b.favorited);
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
