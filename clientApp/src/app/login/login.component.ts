import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private bservice: BookService, private router: Router) { }
  
  username: string = '';
  password: string = '';

  ngOnInit(): void {
  }

  onSubmit(){
    console.log("submit");
    console.log(this.username + " " + this.password);
    this.bservice.login(this.username,this.password).subscribe((result:any) => {
      console.log("result: ");
      console.log(result);
      if(result["result"].localeCompare("successful")==0){
        console.log("it is successful");
        this.bservice.setUser(result["user"]);
        this.router.navigateByUrl("/home");
      }
    }) 
  }
}
