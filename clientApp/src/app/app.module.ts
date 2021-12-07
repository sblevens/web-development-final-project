import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchBooksPipe } from './pipes/search-books.pipe';
import { BookDetailsComponent } from './book-details/book-details.component';
import { LoginComponent } from './login/login.component';
import { MyreviewsComponent } from './myreviews/myreviews.component';
import { TobereadComponent } from './toberead/toberead.component';
import { NavComponent } from './nav/nav.component';
import { SplashComponent } from './splash/splash.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'detail/:id', component: BookDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'myreviews', component: MyreviewsComponent },
  { path:'toberead', component:TobereadComponent },
  { path: 'splash', component: SplashComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchBooksPipe,
    BookDetailsComponent,
    LoginComponent,
    MyreviewsComponent,
    TobereadComponent,
    NavComponent,
    SplashComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
