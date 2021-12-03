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
  title: string = 'LOGIN';

  login: boolean = true;

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.login){
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
    } else {
      console.log("register");
      this.bservice.register(this.username,this.password).subscribe((result:any)=>{
        if(result){
          this.bservice.login(this.username,this.password).subscribe((result:any)=>{
            if(result["result"].localeCompare("successful")==0){
              this.bservice.setUser(result["user"]);
              this.router.navigateByUrl("/home");
            }
          })
        }
      })
    }
    
  }

  setRegister(){
    if(this.login){
      document.getElementById('submit-btn')!.style.display = 'none';
      this.title = "REGISTER";
      this.login = false;
    } else {
      this.onSubmit();
    }
    
  }

}
