import { Component, OnInit } from '@angular/core';
import { TypeAd } from 'src/app/Classes/typeAd';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';



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

  public Ads = Array();
  public imgs = Array();

  public VipAds = Array();
  public VipImgs = Array();

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
    private route : Router
  ) {
   
    this.LoadNewItem();

    this.httpService.getCategories().subscribe( 
      res => {
        if(res instanceof Array){
         this.typeAd.Categories = res;
        }
      }
     )

     this.httpService.getBrands().subscribe( 
       res => {
         if(res instanceof Array){
          this.typeAd.Brends = res;
         }
       }
      )
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
        }
    );
  }
  }

  public ChangeCheckBoxCat(event : any){
    let idCat = event.target.getAttribute("id");
    console.log(idCat)
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
    this.LoadVipAds();
    this.httpService.GetAdsPagination(
      this.activePage,
      this.activeCat.id,
      this.activeBrend.id ).subscribe(
      res => {
        let response : any = res;
        let count = Number(response.countPages.toString());

        this.countPage = new Array();
        for(let i = 1 ; i <= count; i++){
          this.countPage.push(i);
        }

        this.Ads = response.data;
        this.imgs = new Array(count);
        this.LoadMainImgs();
        this.UpdatePagination();      
      } 
    )
  }

  LoadVipAds(){
    this.httpService.GetVipAds()
    .subscribe( res => {
     
      let ads : any = res;
      for(let i = 0; i < ads.length; i++ ){
        this.VipAds[i] = ads[i];
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
