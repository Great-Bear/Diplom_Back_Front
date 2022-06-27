import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { AuthUserResponse } from 'src/app/Classes/auth-user-response';
import { Router } from '@angular/router';
import { CookieService  } from 'ngx-cookie-service';  
import { GlobalHubService } from 'src/app/global-hub.service';
import { AlertMessage } from 'src/app/Classes/alert-message';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  constructor(private httpSevice: HttpService, private router : Router,
              private cookieService: CookieService,
              private globalHub : GlobalHubService ) 
              {
                let idUser = this.cookieService.get("idUser");
                if(idUser.length != 0){
                  this.router.navigate(['/home']);
                }
              }

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

                  if(authData.role == "Admin"){
                    this.globalHub.AdminUser(true);
                  }
                  else
                  {
                    this.globalHub.AdminUser(false);
                  }

                }
                else{
                  let aMessage = new AlertMessage();
                  aMessage.Title = "Попередження"
                  aMessage.Message = authData.error;
                  aMessage.TimeShow = 20000;
                  this.globalHub.addAlertMessage(aMessage);
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
          ? "Некоректний логін" 
          : "";

          if( this.passwd.length < 8 ){
            this.passwdErrMsg = "Пароль має бути мінімум із 8 символів" ;
          }    
          else if( !this.upCaseRegExp.test( this.passwd ) ) {
            this.passwdErrMsg = "У паролі має бути хоча б одна велика літера" ;
          }
          else if( !this.lowCaseRgExp.test( this.passwd ) ){
            this.passwdErrMsg = "У паролі має бути хоча б одна маленька буква" ;
          }
          else if( !this.specSymRegExp.test(this.passwd) ){
            this.passwdErrMsg = "У паролі має бути хоча б один спец. символ" ;
          }
          else{
            this.passwdErrMsg = "";
          }
          return ( this.loginErrMsg + this.passwdErrMsg ) != ""
            ?  false : true; 
        }


        checkPassword( passwd : string){
          let err;
          if( passwd.length < 8 ){
            err = "Пароль має бути мінімум із 8 символів" ;
          }    
          else if( !this.upCaseRegExp.test( passwd ) ) {
            err = "У паролі має бути хоча б одна велика літера" ;
          }
          else if( !this.lowCaseRgExp.test( passwd ) ){
            err = "У паролі має бути хоча б одна маленька буква" ;
          }
          else if( !this.specSymRegExp.test( passwd ) ){
            err = "У паролі має бути хоча б один спец. символ" ;
          }
          else{
            err = "";
          }
          return err;
        }
        

      ResertPassword(){
        if(this.loginRegExp.test( this.login )){
          let msg = 'Введіть новий пароль';
          let isResetPwd = false;
          let oldPsd = "";

          while(!isResetPwd){     
            let newPsd = prompt( msg, oldPsd );

            if(newPsd == null){
              return;        
            }
        
            msg = this.checkPassword(newPsd);

            if(msg == ""){
              isResetPwd = true;
            }

            oldPsd = newPsd;
          }
         
          let newPassword = {
            email: this.login,
            newPasswd: oldPsd
          }

          this.httpSevice.resetPasswd(newPassword)
          .subscribe( res => {
            let response : any = res;

            let aMessage = new AlertMessage();
            if(response.isError){          
              aMessage.Message = response.message;
            }
            else{
              aMessage.Title = "Успішно";
              aMessage.Message = "Пароль змінений";
            }            
            this.globalHub.addAlertMessage(aMessage);
          }, err => {
            this.globalHub.addAlertMessage(new AlertMessage());
          })
        }
        else{
          alert("Введіть правильну пошту");
        }
      }
      showCookie(){
        console.log(this.cookieService.getAll());
      }
}
