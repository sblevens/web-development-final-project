import { Component, OnInit } from '@angular/core';
import { SearchBooksPipe } from '../pipes/search-books.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { 
    // this.adding_review = false;
  }

  ngOnInit(): void {
  }

  search: string = '';
  adding_review = false;
  book_name: string = '';
  book_author: string = '';
  book_rating: number = 1;
  book_review: string = '';

  
  books = [
    {name: 'Frog and Toad',author: 'Tom Riddle',rating:5},
    {name: 'Series of Unfortunate Events',author: 'Lemony Snicket',rating:3},
    {name: 'Little Women',author: 'Jo March',rating:5},
    {name: 'Name of the Wind',author: 'Katie Stevens',rating:4},
    {name: 'Twilight',author: 'Stephanie Myers',rating:5},
    {name: 'Harry Potter',author: 'JK Rowl',rating:5},
    {name: 'Percy Jackson',author: 'Ricky Ricky Man',rating:5}

  ];

  toggleShow(){
    this.adding_review = !this.adding_review;
  }

  addReview() {
    console.log("test");
    this.adding_review = true;
    console.log(this.adding_review);
  }

  onSubmit() {
    let book = {name: this.book_name, author: this.book_author, rating: this.book_rating};
    this.books.push(book);
    this.book_name = '';
    this.book_author = '';
    this.book_rating = 1;
    this.book_review = '';
    this.adding_review = false;
  }

  


  

}
