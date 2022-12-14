import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import {BookDetail} from '../model/bookDetail';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, private bservice: BookService, private router: Router
  ) {
    this.display_review = [];
   }

  ngOnInit(): void {
    this.user = this.bservice.getUser();
    if(!this.user){
      this.router.navigateByUrl('/login');
    }
    this.display_name = "";
    this.display_review = [];
    this.getName();
    this.getDisplayReviews();
  }

  user: string = '';
  display_name: string = '';
  display_review: BookDetail[];
  favorited:boolean = false;
  toBeRead: boolean = false;
  display_error: string = '';


  getDisplayReviews(){
    this.bservice.getBookDetail(this.user,this.display_name).subscribe((result:any) => {
      this.display_review = result["results"];
      console.log("display reviews: " +this.display_review);
      console.log(result["favorited"]);
      this.favorited = result["favorited"];
      this.toBeRead = result["toBeRead"];
    })

    ///let reviews = this.all_reviews[this.id-1].reviews;
    //this.display_reviews.pop();
    //this.display_reviews.push(reviews);
  }

  getName(){
      this.display_name = this.route.snapshot.params['id'];
      console.log("this is id: " + this.display_name);
  }

  toggleFavorited(e:any){
    this.favorited = !this.favorited;
    this.bservice.toggleFavorite(this.favorited,this.user,this.display_name).subscribe((result:any)=>{
      console.log(result);
      if(result["errors"]){
        if(this.favorited){
          this.display_error = 'There was an error favoriting this book.';
        } else {
          this.display_error = 'There was an error un-favoriting this book.';
        }
        
      }
      
    });
    
  }

  toggleToBeRead(e:any){
    this.toBeRead = !this.toBeRead;
    this.bservice.toggleToBeRead(this.toBeRead,this.user,this.display_name).subscribe((result:any)=>{
      console.log(result);
      if(result["errors"]){
        if(this.toBeRead){
          this.display_error = 'There was an error adding this book to your To Be Read list.';
        } else {
          this.display_error = 'There was an error removing this book from your To Be Read list.';
        }
        
      }
    });
  }
}
