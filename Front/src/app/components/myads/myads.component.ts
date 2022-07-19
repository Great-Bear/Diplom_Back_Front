import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalHubService } from 'src/app/global-hub.service';
import { AlertMessage } from 'src/app/Classes/alert-message';


@Component({
  selector: 'app-myads',
  templateUrl: './myads.component.html',
  styleUrls: ['./myads.component.css']
})


export class MyadsComponent implements OnInit {

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";
 
  public noAds : boolean = false
  isLoadItem = false;


  Ads = new Array();

  adsLineTest = new Array();

  countPublishItem : any;
  countNoPublish : any;
  countReject : any;
  countCheking : any;

  nowActivePage : number = 0;
  arrCountsItem = new Array(4);


  private itemInRow = 4;

  constructor(
    private httpService : HttpService,
    private cookie : CookieService,
    private sanitizer: DomSanitizer,
    private route : Router,
    private globalHubService : GlobalHubService
  ) {
  }

  ngOnInit(): void {
   this.loadAds(null,3);
  }

  choiceActivePage : any;

  loadAds(event : any,statusAd : number){

    if(this.isLoadItem){
      return;
    }

    if(event == null){
      this.nowActivePage = 0;
      this.choiceActivePage = document.getElementsByClassName("choice-fluid")[0];
    }
    else{
      this.nowActivePage = event.currentTarget.id;
      this.choiceActivePage.classList.remove("choice-fluid")

      event.currentTarget.classList.add("choice-fluid")
      this.choiceActivePage = event.currentTarget;
    }

    this.Ads = new Array();
    this.isLoadItem = true;

    this.httpService.getGetMyAds(this.cookie.get("idUser"), statusAd)
    .subscribe(ans => {
      let res : any  = ans;
      this.isLoadItem = false;
      if(res.isError){
        this.globalHubService.addAlertMessage(new AlertMessage());
        return;
      }      
      for(let i = 0; i < this.arrCountsItem.length; i++){
        this.arrCountsItem[i] = res.countsItem[i];
      }

      this.Ads = res.ads;
      if(this.Ads instanceof Array){
        if(this.Ads.length == 0){
          this.noAds = true;
        }
        else{
          this.noAds = false;
          for(let ad of this.Ads){
            ad.url = "";
            this.httpService.getMainPicture(ad.id, ad )
              .subscribe(
                res => {        
                  const urlToBlob = window.URL.createObjectURL(res)  
                  ad.url = this.sanitizer
                  .bypassSecurityTrustResourceUrl(urlToBlob);              
                });
          }
        }
      }
      else{
       this.globalHubService.addAlertMessage(new AlertMessage());
      }
    })
  }

  watchAd(event : any){
    this.route.navigate([`/my-ads/card-ad/${event.target.getAttribute("id")}`]);
  }

  editAd(event : any){
    this.route.navigate([`/my-ads/edit-ad/${event.target.getAttribute("id")}`]);
  }

  deleteAd(event : any){
    let isDelete = false;

    if(this.nowActivePage == 3){
      isDelete = confirm("Ви бажаєте видалити оголошення?");
    }
    else{
      isDelete = confirm("Ви бажаєте сховати оголошення?");
    }

    if(isDelete){
      
      this.httpService.deleteAd(event.target.getAttribute("id"))
      .subscribe(res => {
        let answer : any = res;
        if(answer.isError == false){
          if(this.nowActivePage != 3){
            this.arrCountsItem[3]++;
          }
        }

      })
      this.deleteItemFromCollection(event.target.getAttribute("id"));     
    }
  }

  deleteItemFromCollection(idAd : number){
  
    this.Ads = this.Ads.filter( ad => { return ad.id != idAd } );

    this.arrCountsItem[this.nowActivePage]--;
    if(this.arrCountsItem[this.nowActivePage] == 0){
      this.noAds = true;
    }
     
  }

  PublishAd(idAd : number){
    this.httpService.changeStateAd(idAd, 2)
    .subscribe(res => {
      let answer : any = res;
      if(answer.isError == false){
        this.arrCountsItem[1]++;
        this.deleteItemFromCollection(idAd);
      }
      else
      {
        alert("error");
      }
    }
  )
}

}
