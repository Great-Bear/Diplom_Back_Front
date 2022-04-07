import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { AuthUserResponse } from 'src/app/Classes/auth-user-response';
import { Router } from '@angular/router';
import {  CookieService  } from 'ngx-cookie-service';  

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  constructor(private httpSevice: HttpService, private router : Router,
              private cookieService: CookieService ) { }

  login : string = "string";
  passwd : string = "string";

  ngOnInit(): void {
  }

  sendDataAuth(){

  const body = { login : this.login, password : this.passwd }

  let subRegUsr = this.httpSevice.authUser( body )
            .subscribe( resObj  => {
              console.log(resObj)

              if(resObj instanceof Object)
              {
                let authData = new AuthUserResponse(resObj);

                if(authData.error == null){
                  this.cookieService.set( "idUser", authData.id)
                  this.router.navigate(['/home']);
                }

                return;
              }      
              subRegUsr.unsubscribe();
              console.log("Show message error server");

          });
        }  
}
