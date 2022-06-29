import { Component, OnInit } from '@angular/core';
import { TypeAd } from 'src/app/Classes/typeAd';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';
import { CookieService  } from 'ngx-cookie-service';  



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public typeAd = new TypeAd();

  public countPage = Array();

  public linePagin = Array();
  public countLinePagin = 10;
  public activePage : number = 1 ;

  public isLoadItem = true;

  public Ads = Array();
  public imgs = Array();

  public VipAds = Array();
  public VipImgs = Array();

  public acrivePartPage = 0;

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  public activeCat = {
    object : null,
    id : 0
  }

  public activeBrend = {
    object : null,
    id : 0
  }

  public isLeftDis = true;
  public isRightDis = true;

  constructor(
    private httpService : HttpService,
    private sanitizer: DomSanitizer,
    private route : Router,
    private globalHub : GlobalHubService,
    private cookie : CookieService
  ) {
    this.LoadNewItem();
    this.LoadCategoreis();
    this.LoadBrends();
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

   private LoadBrends(){
    if( !(this.globalHub.currentbrends.getValue() instanceof Array) ){
      this.globalHub.brends.subscribe(res => {
       this.typeAd.Brends = res;
      })
    }
    else{
      let brends : any = this.globalHub.currentbrends.getValue();
      this.typeAd.Brends = brends;
    }
   }

   private parseCatLayer(carLayer : any){
    
    let catsList = new Array();


    for(let itemL3 of carLayer){
        let catItem = {
          name : itemL3.layer2,
          id : itemL3.layer2Id
        }
         catsList.push(catItem);
    }
    this.typeAd.Categories = catsList;

    console.log(this.typeAd.Categories);
    
  }


   addFavoriteAd(event : any, idAd : number){
    event.stopPropagation();
   
    let aMessage = new AlertMessage();
    aMessage.Title = "Успешпо";

    let item = this.Ads.find( ad => ad.id == idAd );

    let vipAd = this.VipAds.find( ad => ad.id == idAd );




        let idUser = Number.parseInt( this.cookie.get("idUser"));
        let addToFavorite : boolean;
        let targetItem : any;
        if(item != undefined){
           addToFavorite = !item.isFavorit;
           targetItem = item
        }
        else{
          addToFavorite = !vipAd.isFavorit;
          targetItem = vipAd
        }

        if(vipAd != undefined){
          item.isFavorit = !item.isFavorit;
        }
        if(vipAd != undefined){
          vipAd.isFavorit = !vipAd.isFavorit;
        }

    
        this.httpService.updateFavorite(idUser, idAd,addToFavorite)
        .subscribe( res  => {
          let response : any = res;
          if(response.isError == false){

            if(item != null && item != undefined){
              item.isFavorit = addToFavorite;
            }

            if(vipAd != null && vipAd != undefined){
              vipAd.isFavorit = addToFavorite;
            }
            let valueCount = 0;

            if(targetItem.isFavorit){   
              valueCount++;
            }
            else{     
              valueCount--;
            }

            this.globalHub.changeCountFavoriteAd(valueCount);
          }
          else{
            console.log("error server")
            this.globalHub.addAlertMessage(aMessage);
          }
        },
        err => {
          console.log("error server")
          this.globalHub.addAlertMessage(aMessage);
        }); 
        
   }


   changePartPage( event : any){
    let numberPart = 0;
    for(let item of event.currentTarget.children){
      if(item == event.target){
        this.acrivePartPage = numberPart;
      }
      numberPart++;
    }

    console.log(this.acrivePartPage);

    this.activePage = 1;
    this.LoadNewItem();
   }

   private indexStartPag = 0;
   setActivaPagin(event : any){
    let idPag = event.target.id;
    if(idPag == ""){
      return;
    }
    if(idPag == 0 ){
      this.activePage--;
    }
    else if(idPag == Number(this.countPage.length) +  Number(2) ){
      this.activePage++;
    }
    else{
      this.activePage = idPag;
    }
     
      let indexActivePage = this.linePagin.findIndex( i => i == this.activePage);
      let rightBorderPag = this.linePagin.length - 1;
      let leftBorderPag = 0;
      let stepPag = this.linePagin.length - 1;


      if(indexActivePage == rightBorderPag){ 
      let needStock = this.countPage.length - this.linePagin[rightBorderPag];
     
      if( needStock > stepPag ){
        this.indexStartPag += stepPag;
      }
      else{
        this.indexStartPag += needStock;
      }
    }
    else if(indexActivePage == leftBorderPag){
      let needStock = this.linePagin[leftBorderPag] - stepPag;

      if( needStock <= 0 ){
        this.indexStartPag = 0;
      }
      else{
        this.indexStartPag -= stepPag;
      }
    }

    this.LoadNewItem();
  }
   
  LoadFavorite(){

    let idUser = Number.parseInt(this.cookie.get("idUser"));
    if(isNaN(idUser)){
      return;
    }

    this.httpService.getFavoriteAd(idUser)
    .subscribe(
      res => {
       let resData : any  = res ;
       if(resData.isError){
        let aMessage = new AlertMessage();
        this.globalHub.addAlertMessage(aMessage);
       }
       else{
         if(resData.arrFavorite instanceof Array){
           for(let itemFav of resData.arrFavorite){
            let ad = this.Ads.find( a => a.id == itemFav.adId )
            let adVip = this.VipAds.find( aV => aV.id == itemFav.adId )
           
            if(ad != null && ad != undefined){
              ad.isFavorit = true;
            }
            if(adVip != null && ad != undefined){
              adVip.isFavorit = true;
            }

           }
         }
       }
      },
      err => {
        let aMessage = new AlertMessage();
        aMessage.Title = "Помилка :(";
        aMessage.Message = "Сервер поки що відпочиває";
        this.globalHub.addAlertMessage(aMessage);
      }
    )
  }

  ChoiceCategoty(event : any){  
    this.route.navigate([`/list_ads/${event.target.id}`]);
  }

  UpdatePagination(){
      let count = this.countPage.length;
  
      if(count < 10){
        this.countLinePagin = count
        this.linePagin = new Array(count)
      }
      else{
        this.countLinePagin = 10
        this.linePagin = new Array(10)
      }
      

        let index = 0;
        let reserveCount = Number(this.indexStartPag) + Number(this.linePagin.length);

        for(let i = this.indexStartPag ; i < reserveCount ; i++ ){
          this.linePagin[index++] = this.countPage[i] ;
        }

        this.isLeftDis = this.activePage > 1 ? false : true;
        this.isRightDis = this.activePage < this.countPage.length ? false : true;

  }

  public LoadMainImgs(){

    for(let i = 0; i < this.Ads.length; i++){
      this.httpService.getMainPicture(this.Ads[i].id, this.imgs[i] ).subscribe(
        res => {          
        const urlToBlob = window.URL.createObjectURL(res)  
        this.imgs[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);              
        },
        err => {
          this.imgs[i] = this.emptyImgUrl;
        }
    );
  }
  }

  
  public LoadVipMainImgs(){

    for(let i = 0; i < this.VipAds.length; i++){
      this.httpService.getMainPicture(this.VipAds[i].id, this.VipImgs[i] ).subscribe(
        res => {         
        const urlToBlob = window.URL.createObjectURL(res)  
        this.VipImgs[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
        },
        err =>{
          this.imgs[i] = this.emptyImgUrl;
        }
    );
  }
  }

  public ChangeCheckBoxCat(event : any){
    let idCat = event.target.getAttribute("id");
    if(idCat != null){
      idCat++;
      if(idCat == this.activeCat.id){
        this.activeCat.object == null;
        this.activeCat.id = 0;
      }
      else{
          if(this.activeCat.object != null){
            let chekBox = this.activeCat.object as HTMLInputElement;
            chekBox.checked = false;
          }
          this.activeCat.id = idCat;
        
          this.activeCat.object = event.target;
          this.activePage = 1;
          this.indexStartPag = 0;     

    }
    this.LoadNewItem();
  }
}


public ChangeCheckBoxBrend(event : any){
  let idBrend =  event.target.getAttribute("id");

  if(idBrend != null){

    if(this.acrivePartPage != 0){
      this.acrivePartPage = 0;
    }

    idBrend %= 100;
    idBrend++;
    if(idBrend == this.activeBrend.id){
      this.activeBrend.object == null;
      this.activeBrend.id = 0;
    }
    else{
        if(this.activeBrend.object != null){
          let chekBox = this.activeBrend.object as HTMLInputElement;
          chekBox.checked = false;
        }
        this.activeBrend.id = idBrend;
      
        this.activeBrend.object = event.target;
        this.activePage = 1;
        this.indexStartPag = 0;     

  }
  this.LoadNewItem();
}
}

  public LoadNewItem(){
    this.isLoadItem = true;
    this.LoadVipAds();
    if(this.acrivePartPage == 0){
      this.httpService.GetAdsPagination(
        this.activePage,
        this.activeCat.id,
        this.activeBrend.id ).subscribe(
        res => {
          this.parseAnswer(res);
          this.isLoadItem = false;
        },
        err => {
          let aMessage = new AlertMessage();
          aMessage.Message ="Неможливо завантажити товари";
          this.globalHub.addAlertMessage(aMessage);
        } 
      )
    }
    else if(this.acrivePartPage == 1){
      this.httpService.getPopularAds(this.activePage)
      .subscribe( res => {
        this.parseAnswer(res);
      }, err => {
        let aMessage = new AlertMessage();
        aMessage.Message ="Не вдалося завантажити популярні товари";
        this.globalHub.addAlertMessage(aMessage);
      });
    }
    else{
      let idUser = Number.parseInt( this.cookie.get("idUser") );
      this.httpService.getRecommendedAds(this.activePage,idUser)
      .subscribe( res => {
        this.parseAnswer(res);
      }, err => {
        let aMessage = new AlertMessage();
        aMessage.Message ="Не вдалося завантажити рекомендовані товари";
        this.globalHub.addAlertMessage(aMessage);
      });
    }
  }

  parseAnswer(res : object){
    let response : any = res;
        let count = Number(response.countPages.toString());

        this.countPage = new Array();
        for(let i = 1 ; i <= count; i++){
          this.countPage.push(i);
        }

        this.Ads = response.data;
        console.log(this.Ads);

        for(let i = 0; i < this.Ads.length; i++ ){
          this.Ads[i].isFavorit = false;
        }

        this.imgs = new Array(count);
        this.LoadMainImgs();
        this.UpdatePagination();   
        this.LoadFavorite();   
  }

  LoadVipAds(){
    this.httpService.GetVipAds()
    .subscribe( res => {
     
      let ads : any = res;
      for(let i = 0; i < ads.length; i++ ){
        this.VipAds[i] = ads[i];
        this.VipAds[i].isFavorit = false;
      }
      this.LoadVipMainImgs();
    }, 
    err => {
      console.log("error server");
    }
    )
  }

  watchAd(event : any){
    this.route.navigate([`/card-ad/${event}`]);
  }

  ngOnInit(): void {
  }

}
