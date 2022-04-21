import { Component, EventEmitter, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
import { RegResp } from 'src/app/Classes/reg-resp';
import { CookieService } from 'ngx-cookie-service';
import { GlobalHubService } from 'src/app/global-hub.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private httpSevice: HttpService, private router: Router,
              private cookieService : CookieService,
              private globalHub : GlobalHubService) { }

  loginRegExp : RegExp = new RegExp("^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$");
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
                console.log(resData);

                if(resData.error == null){
                  this.cookieService.set( "idUser", resData.id)
                  this.globalHub.AnonimUser(false);
                  this.router.navigate(['/home']);
                  this.cookieService.set("activeSession","yes");
                }

                return;
               }

                subRegUsr.unsubscribe();
                console.log("Show message error server");
              
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
