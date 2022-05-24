import { Component } from '@angular/core';
import {  CookieService  } from 'ngx-cookie-service';  
import { Router } from '@angular/router';
import { GlobalHubService } from './global-hub.service';
import { NavigationEnd } from '@angular/router';
import { AlertMessage } from './Classes/alert-message';
import { of, timer, concatMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jubuse-app';
  abs: JSON | any;

  isAnonimUser = true;
  isModer = false;

  searchWord = "";

  arrAlertMessage = Array<AlertMessage>();

  showSearchBlock = false;
  
  constructor(private cookieService : CookieService,
              private router : Router,
              private globalHub : GlobalHubService) {
  this.globalHub.isAnonim.subscribe( 
    state => {
      this.isAnonimUser = state;
    }
   )


   this.globalHub.isModer.subscribe(
     state => {
       this.isModer = state;
     }
   )

   this.globalHub.AlertMessage.subscribe(item =>{
     this.arrAlertMessage.push(item);

  timer(item.TimeShow)
    .pipe()
    .subscribe( () =>{
      this.arrAlertMessage.pop();
    });
   })

   this.globalHub.AnonimUser(true);

    this.globalHub.ModerUser( Boolean( this.cookieService.get("isModer")) )

}

HiddenAlertMessage(event : any){
  if(event.target.classList.contains("closeBtnAlMess")){
    event.currentTarget.hidden = true;
  }
}

inputSearchWord(){
 this.globalHub.ChangeSearchWord(this.searchWord);
}

startSearch(){
  if(this.searchWord.length == 0){
    return;
  }
  if(!this.router.url.includes("list_ads")){
    this.router.navigate([`/list_ads/0/${this.searchWord}`]);
  }
  this.globalHub.StartSeachAction();
}

ngOnInit(){


  if(this.cookieService.get("idUser").length > 0 &&
    Number(this.cookieService.get("timeOutSession")) > new Date().getTime()  ){
      this.globalHub.AnonimUser(false);
      this.cookieService.set("activeSession","yes");
    }
    else{
      this.cookieService.set("activeSession","no");
    }

 this.router.events.subscribe( event => {
  if(event instanceof NavigationEnd){
     if(event.url != "/registration" && event.url != "/authorization"){
        if( this.cookieService.get("idUser").length == 0){
            this.router.navigate(['/registration'])
        }
        if(this.cookieService.get("rememberMe") != "yes" && 
           this.cookieService.get("activeSession") != "yes" ){
            this.router.navigate(["/authorization"])
        }   
    }
    if(event.url.includes("/list_ads") || event.url == "/home"){
      this.showSearchBlock = true;
    }
    else{
      this.showSearchBlock = false;
    }
  }
 })
 

 window.onunload = (event) => {
  this.cookieService.set("timeOutSession", (new Date().getTime() + 60000).toString() );
 }


}

  LogOut(){
    this.cookieService.set("rememberMe","no");
    this.cookieService.set("activeSession","no");
    this.cookieService.set("idUser","")
    this.cookieService.set("isModer", String(false));
    this.router.navigate(["/registration"]);
    this.globalHub.AnonimUser(true);
    this.globalHub.ModerUser(false);
  }


}
