import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { BookDetail } from '../model/bookDetail';

@Component({
  selector: 'app-myreviews',
  templateUrl: './myreviews.component.html',
  styleUrls: ['./myreviews.component.css']
})
export class MyreviewsComponent implements OnInit {

  constructor(private bservice: BookService,private router: Router) {
    this.reviews = [];
   }

  reviews: BookDetail[];
  user: string = '';

  ngOnInit(): void {
    console.log("ng init");
    this.user = this.bservice.getUser();
    if(!this.user){
      this.router.navigateByUrl('/login');
    }
    console.log(this.user);
    this.bservice.getReviews(this.user).subscribe((result:any) =>{
      this.reviews = result;
    });
  }



}
