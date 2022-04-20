import { Component } from '@angular/core';
import {  CookieService  } from 'ngx-cookie-service';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jubuse-app';
  abs: JSON | any;

  isAnonimUser = true;
  
  constructor(private cookieService : CookieService,
              private router : Router) {}

ngOnInit(){

  console.log("init")

}

  CheckCookie(){

    console.log(this.cookieService.getAll());

    if( this.cookieService.get("idUser") == "" &&
     this.cookieService.get("idUser") == null){
     this.router.navigate(['/registration'])
    }
    else{
      if(this.cookieService.get("rememberMe") == "no" || 
      this.cookieService.get("rememberMe") == "" ){
        this.router.navigate(["registration"])
      }
      else{
        this.isAnonimUser = false;
      }
    }
    
  }

  LogOut(){
    this.cookieService.set("rememberMe","no");
    this.cookieService.set("idUser","")
    this.router.navigate(["/registration"]);
    this.isAnonimUser = true;
  }

  
  ngDoCheck() {    
    this.CheckCookie();
  }


  private log(msg: string) {
      console.log(msg);
  }

}
