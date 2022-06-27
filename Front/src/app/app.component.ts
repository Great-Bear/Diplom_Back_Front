import { Component } from '@angular/core';
import {  CookieService  } from 'ngx-cookie-service';  
import { Router } from '@angular/router';
import { GlobalHubService } from './global-hub.service';
import { NavigationEnd } from '@angular/router';
import { AlertMessage } from './Classes/alert-message';
import { timer } from 'rxjs';
import { HttpService } from './http.service';
import { CollectionLocation } from './Classes/collection-location';

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
  isAdmin = false;

  locationValue = "Вся Україна";
  showDropListLocations = false;

  distanceValue = "+ 100 км";
  showDistance = false;

  idUser = 0;

  searchWord = "";

  countFavoriteAd : number = 0;
  countUnreadMsg : number = 0;

  arrAlertMessage = Array<AlertMessage>();

  showSearchBlock = false;

  collLocation = new Array();

  sameWords = new Array();
  
  constructor(private cookieService : CookieService,
              private router : Router,
              private globalHub : GlobalHubService,
              private http : HttpService) {

  this.globalHub.isAnonim.subscribe( 
    state => {
      this.isAnonimUser = state;
      if(state == false){
        this.UpdateInfoPanel();
      }
    }
   )
    this.idUser = Number.parseInt( this.cookieService.get("idUser") );
    if( !isNaN(this.idUser) ){
      this.globalHub.AnonimUser(false);
    }


   this.globalHub.isModer.subscribe(
     state => {
       this.isModer = state;
     }
   )

     this.globalHub.isAdmin.subscribe(
      state => {
        this.isAdmin = state;
      }
     )

     this.http.getCategoriesLayer()
                 .subscribe(res => {
                   this.globalHub.ChangeCatLayers(res);
                 })
    this.http.getBrands().subscribe( 
      res => {
        this.globalHub.ChangeBrends(res);
      }
    )


   this.globalHub.AlertMessage.subscribe(item =>{
     this.arrAlertMessage.push(item);

  timer(item.TimeShow)
    .pipe()
    .subscribe( () => {
      this.arrAlertMessage.shift();
    });
   })

   this.globalHub.countFavoriteAd.subscribe(count => {
    this.countFavoriteAd = count;
  })
   this.globalHub.ModerUser( Boolean( this.cookieService.get("isModer")) )
   this.globalHub.AdminUser( Boolean( this.cookieService.get("isAdmin")) )


  this.collLocation = new CollectionLocation().getDefautCollection();


  if(this.cookieService.get("idUser").length > 0 &&
  Number(this.cookieService.get("timeOutSession")) > new Date().getTime()  ){
    this.globalHub.AnonimUser(false);
    this.cookieService.set("activeSession","yes");
    this.cookieService.set("timeOutSession", "0");
  }
  else{
    this.cookieService.set("activeSession","no");
    console.log("session is out");
    console.log("idUser:" + this.idUser)
    console.log(this.cookieService.get("timeOutSession") + "|" + new Date().getTime());
  }

this.router.events.subscribe( event => {
if(event instanceof NavigationEnd){
   if(event.url != "/registration" && event.url != "/authorization" && !event.url.includes("confirm_Email")){
      if( this.cookieService.get("idUser").length == 0){
          this.router.navigate(['/registration'])
      }
      if(this.cookieService.get("rememberMe") != "yes" && 
         this.cookieService.get("activeSession") != "yes" ){
          this.cookieService.set("idUser","");
          this.router.navigate(["/authorization"])
      }   
  }
  if(event.url.includes("list_ads") || event.url.includes( "home" )
   || event.url == "/" || event.url.includes("card-ad")){
    this.showSearchBlock = true;
  }
  else{
    this.showSearchBlock = false;
  }
}
})


}

  UpdateFavoriteAds(){
    this.http.getCountFavoriteAd(this.idUser)
    .subscribe( res => {
     let response : any = res;     
      this.globalHub.changeCountFavoriteAd(response.count);   
    });
  }

  UpdateInfoPanel(){
    if(this.idUser == 0 || this.isAnonimUser || this.idUser == NaN){
      return;
    }

    let idUser = Number.parseInt( this.cookieService.get("idUser") );
    if(idUser > 0 && idUser != NaN){
      this.idUser = idUser;
      this.UpdateFavoriteAds();
      this.UpdateUnredMessage();
    }
  }

  UpdateUnredMessage(){

    if(this.idUser == 0 || this.isAnonimUser){
      return;
    }

    this.http.getUnreadChatCount(this.idUser)
    .subscribe(res => {
      let response : any = res;
      this.countUnreadMsg = response.countUnreadMsg;
    })
    
      timer(1000)
      .pipe()
      .subscribe( () => {
       this.UpdateUnredMessage();
      }); 
  }


HiddenAlertMessage(event : any){
  if(event.target.classList.contains("closeBtnAlMess")){
    event.currentTarget.hidden = true;
  }
}

showCookie(){
  console.log(this.cookieService.getAll())
}

inputSearchWord(){
  this.loadSameWord(this.searchWord);
 this.globalHub.ChangeSearchWord(this.searchWord);
}

 loadSameWord(word : string){
  this.http.loadSameWords(word)
  .subscribe( res => {
    let response : any = res;
    if(response.isError){

    }
    else{
      this.sameWords = response.data;
    }
  })
 }

 choiceSameWord(word : string){
  this.searchWord = word;
  this.globalHub.ChangeSearchWord(word);

  this.startSearch();
  this.sameWords = new Array();

  this.clearSearchLine();
 }

 clearSearchLine(){
  this.searchWord = "";
  this.globalHub.ChangeSearchWord("");
  this.sameWords = new Array();
 }

startSearch(){
  if(this.searchWord.length == 0){
    return;
  }

  console.log(this.searchWord);

  if(!this.router.url.includes("list_ads")){
    this.router.navigate([`/list_ads/0/${this.searchWord}`]);
  }
  this.globalHub.StartSeachAction();
}

ngOnInit(){


 
 

 window.onunload = (event) => {
  this.cookieService.set("timeOutSession", (new Date().getTime() + 60000).toString() );
 }


}

  LogOut(){
    this.cookieService.set("rememberMe","no");
    this.cookieService.set("activeSession","no");
    this.cookieService.set("idUser","");
    this.cookieService.set("isModer", "");
    this.cookieService.set("isAdmin", "");
    this.router.navigate(["/registration"]);
    this.globalHub.AnonimUser(true);
    this.globalHub.ModerUser(false);

    this.idUser = 0;

    this.globalHub.changeCountFavoriteAd(
      -this.globalHub.countFavoriteAd.getValue()
    )
    this.countUnreadMsg = 0;

  }

  globalClick(event : any)
  {
    if(event.target.id != "serachBlock")
    {
      return
    }

    this.sameWords = new Array();
    this.showDistance = false;
    this.showDropListLocations = false;
  }

  OpenCloseMenuLocation(idRegion: number, idSubPoint : number){
    if(idSubPoint == -1){
      this.collLocation[idRegion].IsOpen = !this.collLocation[idRegion].IsOpen;
    }
    else{
      this.collLocation[idRegion].Children[idSubPoint].IsOpen =
      !this.collLocation[idRegion].Children[idSubPoint].IsOpen;
    }
  }

  choiceLocation(idRegion: number, idSubPoint : number, idSubSubPoint : number){

    let regionValue = this.collLocation[idRegion].Name;
    if(idSubPoint != -1){

      let subvalue = this.collLocation[idRegion].Children[idSubPoint].Name ;
      subvalue += ",";
      subvalue += regionValue;
      regionValue = subvalue;
      if(idSubSubPoint != -1){

        let subSubValue = this.collLocation[idRegion].Children[idSubPoint].Children[idSubSubPoint].Name ;
        subSubValue += ",";
        subSubValue += regionValue;
        regionValue = subSubValue;
      }
    }
    this.locationValue = regionValue;
    this.showDropListLocations = false;
  }

  ClearLocation(){
    this.showDropListLocations = false;
    this.locationValue = "Вся Україна";
  }

  CloseOpenDropList(event: any){
    this.showDropListLocations = !this.showDropListLocations;
    event.stopPropagation();
  }

  CloseOpenDistanceList(event: any){
    this.showDistance = !this.showDistance;
    event.stopPropagation();
  }

  ChoiceValueDistance(event : any){
    this.distanceValue = event?.target.innerText;
  }

}
