import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private bservice: BookService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.bservice.getUser();

  }

  @Input()
  public username!: string;

  user: string = '';

  logout(){
    console.log("logging out");
    
    this.bservice.logout().subscribe((result:any)=>{
      console.log(result);
      this.router.navigateByUrl('/login');
    });
  }
}
