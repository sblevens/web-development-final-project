import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import {BookDetail} from '../model/bookDetail';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, private bservice: BookService
  ) {
    this.display_review = [];
   }

  ngOnInit(): void {
    this.display_name = "";
    this.display_review = [];
    this.getName();
    this.getDisplayReviews();
  }

  display_name: string = '';
  display_review: BookDetail[];


  getDisplayReviews(){
    this.bservice.getBookDetail(this.display_name).subscribe((result:any) => {
      this.display_review = result;
      console.log("display reviews: " +this.display_review);
    })

    ///let reviews = this.all_reviews[this.id-1].reviews;
    //this.display_reviews.pop();
    //this.display_reviews.push(reviews);
  }

  getName(){
      this.display_name = this.route.snapshot.params['id'];
      console.log("this is id: " + this.display_name);
  }


}
