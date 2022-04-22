import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { AuthUserResponse } from 'src/app/Classes/auth-user-response';
import { Router } from '@angular/router';
import { CookieService  } from 'ngx-cookie-service';  
import { GlobalHubService } from 'src/app/global-hub.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  constructor(private httpSevice: HttpService, private router : Router,
              private cookieService: CookieService,
              private globalHub : GlobalHubService ) { }

  login : string = "";
  passwd : string = "";

  //  login : string = "Bogdan";
 //  passwd : string = "1235";

  isMemberMe : boolean = false;

  ngOnInit(): void {
  }

  sendDataAuth(){

  const body = { login : this.login, password : this.passwd }

  let subRegUsr = this.httpSevice.authUser( body )
            .subscribe( resObj  => {

              if(resObj instanceof Object)
              {
                let authData = new AuthUserResponse(resObj);

                if(authData.error == null){

                  if(this.isMemberMe == true){
                    this.cookieService.set("rememberMe","yes")
                  }
                  else{
                    this.cookieService.set("rememberMe","no")
                  }
                  this.globalHub.AnonimUser(false);
                  this.cookieService.set( "idUser", authData.id)
                  this.router.navigate(['/home']);
                  this.cookieService.set("activeSession","yes");

                  if(authData.role == "Moder"){
                    this.globalHub.ModerUser(true);
                  }

                }

                return;
              }      
              subRegUsr.unsubscribe();
              console.log("Show message error server");

          });
        }  
}
