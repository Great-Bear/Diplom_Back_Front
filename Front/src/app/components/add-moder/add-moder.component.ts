import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { GlobalHubService } from 'src/app/global-hub.service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-add-moder',
  templateUrl: './add-moder.component.html',
  styleUrls: ['./add-moder.component.css']
})
export class AddModerComponent implements OnInit {

  constructor(
   private http : HttpService,
   private globalHub : GlobalHubService
  ) { }

  newModer = {
    email : "",
    password : "",
  }

  err = {
    email : "",
    password: "",
  }

  loginRegExp : RegExp = new RegExp("^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$");
  lowCaseRgExp : RegExp = new RegExp("[a-z]")
  upCaseRegExp : RegExp = new RegExp("[A-Z]")
  specSymRegExp : RegExp = new RegExp("[^A-Za-z0-9_]");

  ngOnInit(): void {
  }

  addModer(){

   if(this.validateForm() == false){
    return;
   }

    this.http.addModer(this.newModer)
    .subscribe( res => {
      let response : any = res;
      let aMessage = new AlertMessage();

      if(response.isError){    
        aMessage.Message = response.message;      
      }
      else{
        this.newModer.email = "";
        this.newModer.password = "";
        aMessage.Title = "Успішно";
        aMessage.Message = "Модер створенний";     

        this.globalHub.UpdateListModers();

      }
      this.globalHub.addAlertMessage(aMessage);
    },
    err => {
      this.globalHub.addAlertMessage(new AlertMessage());
    }
    )
  }

  validateForm() : boolean {
    this.err.password = this.checkPassword(this.newModer.password);

    if( !this.loginRegExp.test(this.newModer.email) ){
      this.err.email = "Некоректна пошта";
    }
    else{
      this.err.email = "";
    }
    if(this.err.email.length > 0 || this.err.password.length > 0){
      return false;
    }
    return true;
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

}
