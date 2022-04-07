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
  
  constructor(private cookieService : CookieService,
              private router : Router) {}

  ngOnInit() {
   if( this.cookieService.get("idUser") == undefined ||
       this.cookieService.get("idUser") == null){
        this.router.navigate(['/authorization'])
   }
  }

}
