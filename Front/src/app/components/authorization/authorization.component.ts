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

  loginRegExp : RegExp = new RegExp("^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$");
  lowCaseRgExp : RegExp = new RegExp("[a-z]")
  upCaseRegExp : RegExp = new RegExp("[A-Z]")
  specSymRegExp : RegExp = new RegExp("[^A-Za-z0-9_]");


  login : string = "";
  passwd : string = "";

  loginErrMsg : string = "";
  passwdErrMsg : string = "";

  //  login : string = "Bogdan";
 //  passwd : string = "1235";

  isMemberMe : boolean = false;

  ngOnInit(): void {
  }

  sendDataAuth(){

    if(this.ValidetData() == false){
     // return ;
    }

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
                  
                  this.cookieService.set( "idUser", authData.id)
                  this.globalHub.AnonimUser(false);       
                  this.router.navigate(['/home']);
                  this.cookieService.set("activeSession","yes");

                  if(authData.role == "Moder"){
                    this.globalHub.ModerUser(true);
                  }
                  else
                  {
                    this.globalHub.ModerUser(false);
                  }

                }
                else{
                  alert(authData.error)
                }

                return;
              }      
              subRegUsr.unsubscribe();
              console.log("Show message error server");

          }, err => {
            alert("error http");
          });
        }  

        ValidetData() : boolean
        {
          this.loginErrMsg = !this.loginRegExp.test( this.login )
          ? "Некорректный логин" 
          : "";

          if( this.passwd.length < 8 ){
            this.passwdErrMsg = "Пароль должен быть минимум из 8 символов" ;
          }    
          else if( !this.upCaseRegExp.test( this.passwd ) ) {
            this.passwdErrMsg = "В пароле должа быть хотя бы одна большая буква" ;
          }
          else if( !this.lowCaseRgExp.test( this.passwd ) ){
            this.passwdErrMsg = "В пароле должа быть хотя бы одна маленькая буква" ;
          }
          else if( !this.specSymRegExp.test(this.passwd) ){
            this.passwdErrMsg = "В пароле должен быть хотя бы один спец. символ" ;
          }
          else{
            this.passwdErrMsg = "";
          }
          return ( this.loginErrMsg + this.passwdErrMsg ) != ""
            ?  false : true; 
        }

}
