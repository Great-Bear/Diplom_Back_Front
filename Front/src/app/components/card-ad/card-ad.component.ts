import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-ad',
  templateUrl: './card-ad.component.html',
  styleUrls: ['./card-ad.component.css']
})
export class CardAdComponent implements OnInit {

  data : any = "";
  imgs : any;
  firstImg : any;
  isOwner = false;

  idChat = 0;
  idUser = 0;
  idAd = 0;

  extraAds = new Array(3);

  currencies = [
    "грн",
    "$",
    "€",
  ]

  constructor(
    private activateRoute: ActivatedRoute,
    private http : HttpService,
    private sanitizer: DomSanitizer,
    private cookie : CookieService,
    private globalHub : GlobalHubService,
    private route : Router) {  
  }

  ngOnInit(): void {
    try {
      let idAd = this.activateRoute.snapshot.params['id'];
      this.idUser = Number.parseInt(this.cookie.get("idUser"));
      this.idAd = idAd;

      this.http.getIdChat(this.idUser, idAd)
      .subscribe( res => {
          let response : any = res;
          if(!response.isError){
            this.idChat = response.idChat;            
          }
      } )
      this.http.getOneAd(idAd).subscribe(
        res => {         
          let response : any = res;

          if(response.isError){
            let aMessage = new AlertMessage();
            aMessage.Message = "Неможливо відкрити товар";
            aMessage.TimeShow = 2000;
            this.globalHub.addAlertMessage(aMessage);
            this.route.navigate([`home`]);
          }

          this.data = response.data;
          console.log(this.data);

          if(this.cookie.get("idUser") == this.data.idOwner){
            this.isOwner = true;
          }

          if(this.data.countImgs == 0){
              this.firstImg = "../assets/imgs/emptyImg.png";
              this.imgs = new Array(1);
              this.imgs[0] = "../assets/imgs/emptyImg.png";
            return;
          }
          this.imgs = new Array(this.data.countImgs)
          
          for(let i = 0; i < this.data.countImgs; i++){
          this.http.GetImgOfAd(idAd, i).subscribe(
            imgBlob => {
              const urlToBlob = window.URL.createObjectURL(imgBlob)  
              this.imgs[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
           
            }
          )
        }
        }
      )
    } catch (error) {
      console.log("Ошибка загрузки товара")
    }
  }

  openChat(){
    if(this.isOwner){
      return;
    }
    if(this.idChat == 0){
      this.http.createChat(this.idUser,this.idAd)
      .subscribe( res => {
        let response : any = res;
        if(response.isError){
          let aMessage = new AlertMessage();
          aMessage.Title = "Ой :(",
          aMessage.Message = "Сервер не зміг відкрити чат";
          this.globalHub.addAlertMessage(aMessage);
        }
        this.idChat = response.idChat;
        this.route.navigate([`chat/${this.idChat}`]);
      },
      err => {
        let aMessage = new AlertMessage();
          aMessage.Title = "Ой :(",
          aMessage.Message = "Сервер поки що відпочиває";
          this.globalHub.addAlertMessage(aMessage);
      })
    }
    else{
      this.route.navigate([`chat/${this.idChat}`]);
    }
  }
}
