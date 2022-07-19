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
  lowCaseRgExp : RegExp = new RegExp("[a-zа-я]")
  upCaseRegExp : RegExp = new RegExp("[A-ZА-Я]")
  specSymRegExp : RegExp = new RegExp("[^A-Za-z0-9_]");



  login : string = "";
  loginErrMsg : string = "";

  passwd : string = "";
  passwdErrMsg : string = "";

  passwd2 : string = "";
  passwd2ErrMsg : string = "";

  confirmPolicy : any = false;
  errConfirmPolicy : boolean = false

  ngOnInit(): void {
  }


  sendData(){
   if(this.ValidetData() == false){
      return;
    } 

    const body = { login : this.login, password : this.passwd }
    let aMessage = new AlertMessage();
    this.httpSevice.registerUser( body )
             .subscribe( resObject => { 
               if(resObject instanceof Object){      
                let resData = new RegResp(resObject);              
                if(resData.error == null){
                  aMessage.Title = "Підтвердіть пошту";
                  aMessage.Message = "На вашу вказану пошту" +
                  "надійшло посилання для підтвердження реєстрації";
                  aMessage.TimeShow = 20000;
                }
                else
                {
                  aMessage.Title = "Попередження";
                  aMessage.Message = resData.error;
                  aMessage.TimeShow = 5000;                
                }
                this.globalHub.addAlertMessage(aMessage);
                return;
               }         
            }, err => {
              this.globalHub.addAlertMessage(aMessage);
            });           
  }
  ValidetData() : boolean
  {
    this.loginErrMsg = !this.loginRegExp.test( this.login ) ? "Некоректний логін" : "";

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

    this.errConfirmPolicy = this.confirmPolicy ? false : true;

    this.passwd2ErrMsg = this.passwd != this.passwd2 ? "паролі повинні збігатися" : "";

    if(this.confirmPolicy == false){
      return false ;
     }
    return ( this.loginErrMsg + this.passwdErrMsg + this.passwd2ErrMsg ) != "" ?  false : true; 
  }
}
