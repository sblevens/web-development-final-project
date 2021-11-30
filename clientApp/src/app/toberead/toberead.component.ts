import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { BookDetail } from '../model/bookDetail';

@Component({
  selector: 'app-toberead',
  templateUrl: './toberead.component.html',
  styleUrls: ['./toberead.component.css']
})
export class TobereadComponent implements OnInit {

  constructor(private bservice: BookService, private router: Router) {
    this.books = []; 
  }

  ngOnInit(): void {
    this.user = this.bservice.getUser();
    if(!this.user){
      this.router.navigateByUrl('/login');
    }
    this.getBooks();
  }

  user: string = '';
  books: Book[];

  getBooks(){
    this.bservice.getToBeRead(this.user).subscribe((result:any)=> {
      console.log("getting result:");
      console.log(result);
      this.books = result;
      for(var b of this.books){
        b.toBeRead = true;
      }
    });
  }

  toggleToBeRead(e:any){
    console.log(e.target.id);
    console.log(this.books);
    let index = -1;
    let i = 0;
    console.log(index + " " + i);
    
    for(var b of this.books){
       if(b.name == e.target.id){
         index = i;
         console.log(index);
       }
       i = i+1;
     }
    console.log(index);
    this.books[index].toBeRead = !this.books[index].toBeRead;
    console.log(this.books[index].toBeRead);
    this.bservice.toggleToBeRead(this.books[index].toBeRead,this.user,e.target.id).subscribe((result:any)=>{
      console.log(result);
      
    });
  }
}
