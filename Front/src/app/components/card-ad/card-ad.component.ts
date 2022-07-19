import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';
import { Router } from '@angular/router';
import { MetaController } from 'src/app/Classes/meta-controller';

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

  isNoImg = true;

  idChat = 0;
  idUser = 0;
  idAd = 0;

  extraAds = new Array(3);

  private metaController =  new MetaController();

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
      this.idUser = Number.parseInt( this.cookie.get("idUser"));
      this.imgs = new Array();
  }

  ngOnInit(): void {
    try {
      let idAd = this.activateRoute.snapshot.params['id'];
      this.idUser = Number.parseInt(this.cookie.get("idUser"));
      this.idAd = idAd;

      if( !isNaN(this.idUser) ){
        this.http.getIdChat(this.idUser, idAd)
        .subscribe( res => {
            let response : any = res;
            if(!response.isError){
              this.idChat = response.idChat;            
            }
        } )
    }
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
          this.data.isFavorit = false;

          this.data.typeOwner = 
            this.metaController.GetTypeOwnersByid(
              this.data.typeOwnerId
            );

            this.data.currency = 
            this.metaController.GetCurrenciesByid(
              this.data.currencyId
            );

            this.data.qualityAd = 
            this.metaController.GetQualityAdsByid(
              this.data.qualityAdId
            );



          let idUser = Number.parseInt( this.cookie.get("idUser"));

          this.LoadCategoreis();
          
          if( !isNaN(this.idUser) ){
            this.http.isFavoriteAd(this.idAd, idUser)
            .subscribe(
              res => {
                let response : any = res;
                this.data.isFavorit = response.isFavorite;
              }
            )
          }

          if(idUser == this.data.userId){
            this.isOwner = true;
          }

          if(response.countImgs == 0){
              this.firstImg = "../assets/imgs/emptyImg.png";
              this.imgs = new Array(1);
              this.imgs[0] = "../assets/imgs/emptyImg.png";
              this.isNoImg = false;
            return;
          }
          this.imgs = new Array(response.countImgs)
          
          for(let i = 0; i < response.countImgs; i++){
          this.http.GetImgOfAd(idAd, i).subscribe(
            imgBlob => {
              const urlToBlob = window.URL.createObjectURL(imgBlob)  
              this.imgs[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
              this.isNoImg = false;
            }
          )
        }
        }
      )
    } catch (error) {
      this.globalHub.addAlertMessage(new AlertMessage());
      
    }
   
  }

  changeStateFavorite(event : any){

    if( isNaN(this.idUser) ){
      let aMessage =  new AlertMessage();
      aMessage.Title = "Попередження"
      aMessage.Message ="Щоб додати оголошення в вибране будь ласка авторизуйтеся";
      aMessage.TimeShow = 4000;

      this.globalHub.addAlertMessage(aMessage);
      return;
    }


    event.stopPropagation();
    this.data.isFavorit = !this.data.isFavorit;


    this.http.updateFavorite(this.idUser, this.idAd, this.data.isFavorit)
    .subscribe(res => {
      let response : any = res;
      if(response.isError){
        this.data.isFavorit = !this.data.isFavorit;     
        return;  
      }
      let valueCountFavorite = this.data.isFavorit ? 1 : -1;
      this.globalHub.changeCountFavoriteAd(valueCountFavorite);
    }, err => {
      this.data.isFavorit = !this.data.isFavorit;
    })
  }


  private LoadCategoreis(){
    if( !(this.globalHub.currentCatLayers.getValue() instanceof Array) ){
      this.globalHub.categoriesLayers.subscribe(res => {
        this.parseCatLayer(res);
      })
    }
    else{
      this.parseCatLayer(
        this.globalHub.currentCatLayers.getValue()
      );
    }
    }

    currentCategory = "";

    private parseCatLayer(carLayer : any){
    
      let catsList = new Array();
  
      for(let itemL3 of carLayer){
        for(let itemL2 of itemL3.data){
          let index = 0;
          for(let cat of itemL2.cat){
            let catItem = {
              name : cat,
              id : itemL2.idCat[index]
            }

             if(catItem.id == this.data.categoryId){
              this.currentCategory =`${itemL3.layer2}/${itemL2.layer1}/${cat}`;
             }
             index++;
          }
        }
      }
    }

    returnPage(){
      window.history.back();
      return;    
    }

  openChat(){

    if(this.isOwner){
      return;
    }

    if( isNaN(this.idUser) ){
      let aMessage =  new AlertMessage();
      aMessage.Title = "Попередження"
      aMessage.Message ="Щоб написати продавцю будь ласка авторизуйтеся";
      aMessage.TimeShow = 4000;

      this.globalHub.addAlertMessage(aMessage);

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
