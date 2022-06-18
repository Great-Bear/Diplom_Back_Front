import { Component, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { RegResp } from 'src/app/Classes/reg-resp';
import { CookieService } from 'ngx-cookie-service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { AlertMessage } from 'src/app/Classes/alert-message';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private httpSevice: HttpService, private router: Router,
              private cookieService : CookieService,
              private globalHub : GlobalHubService) 
              {
              let idUser = this.cookieService.get("idUser");
                if(idUser.length != 0){
                  this.router.navigate(['/home']);
                }
              }

  loginRegExp : RegExp = new RegExp("^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$");
  // RgExp for password
  lowCaseRgExp : RegExp = new RegExp("[a-z]")
  upCaseRegExp : RegExp = new RegExp("[A-Z]")
  specSymRegExp : RegExp = new RegExp("[^A-Za-z0-9_]");



  login : string = "";
  loginErrMsg : string = "";

  passwd : string = "";
  passwdErrMsg : string = "";

  passwd2 : string = "";
  passwd2ErrMsg : string = "";


  ngOnInit(): void {
  }


  sendData(){

  /*  if(this.ValidetData() == false){
      console.log("err Validate");
      return;
    } */

    const body = { login : this.login, password : this.passwd }
    
    let subRegUsr = this.httpSevice.registerUser( body )
             .subscribe( resObject => { 
              let resData;
               if(resObject instanceof Object){
                resData = new RegResp(resObject);
               

                if(resData.error == null){

                  let aMessage = new AlertMessage();

                  aMessage.Title = "Подтвердите почту";
                  aMessage.Message = "На вашу указанную почту пришла ссылка для подтверждения регистрации";
                  aMessage.TimeShow = 20000;

                  this.globalHub.addAlertMessage(aMessage);
                  return
                }

                return;
               }
                subRegUsr.unsubscribe();            
            }, err => {
              let aMessage = new AlertMessage();
              this.globalHub.addAlertMessage(aMessage);
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

    this.passwd2ErrMsg = this.passwd != this.passwd2 
    ? "пароли должны совпадать" 
      : "";

    return ( this.loginErrMsg + this.passwdErrMsg + this.passwd2ErrMsg ) != ""
       ?  false : true; 
  }
}
