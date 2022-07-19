import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalHubService } from 'src/app/global-hub.service';
import { AlertMessage } from 'src/app/Classes/alert-message';



@Component({
  selector: 'app-moder-page',
  templateUrl: './moder-page.component.html',
  styleUrls: ['./moder-page.component.css']
})
export class ModerPageComponent implements OnInit {


  private emptyImgUrl  = "../assets/imgs/emptyImg.png";
 
  public adsCol = Array();
  public noAds : boolean = false

  countAds : any;

  private itemInRow = 4;

  constructor(
    private httpService : HttpService,
    private cookie : CookieService,
    private sanitizer: DomSanitizer,
    private route : Router,
    private globalHub : GlobalHubService
  ) {
  }

  ngOnInit(): void {
   this.loadAds(null,3);
  }

  loadAds(event : any,statusAd : number){

    this.adsCol = new Array();

    this.httpService.getWaitingAds()
    .subscribe(ans => {
      let res : any  = ans;


      res = res.ads;
      if(res instanceof Array){
        
        if(res.length == 0){
          this.noAds = true;
          return;
        }
        else{
          this.countAds = res.length
          this.noAds = false;
        }
        let indexItem = 0;

        for(let colIndex = 0; colIndex < Math.ceil( res.length / this.itemInRow ); colIndex++ ){
          this.adsCol.push(
            new Array()
          )
          for(let rowIndex = 0; rowIndex < this.itemInRow && indexItem < res.length; rowIndex++ ){           
            res[indexItem].timeEnd = new Date(res[indexItem].timeEnd)
            this.adsCol[colIndex].push( {
              data : res[indexItem],
              url : this.emptyImgUrl
            });
            indexItem++;
   
            this.httpService.getMainPicture(res[indexItem - 1].id, this.adsCol[colIndex][rowIndex] ).subscribe(
              res => {         
               const urlToBlob = window.URL.createObjectURL(res)  
               this.adsCol[colIndex][rowIndex].url = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
              }
           );
          }
        }
      }
      else{
       this.globalHub.addAlertMessage(new AlertMessage());
      }
    })
  }

  watchAd(event : any){
    this.route.navigate([`/card-ad/${event.target.getAttribute("id")}`]);
  }

  CONFIRM_AD = 3;
  CANCEL_AD = 4;



  actionAd(event : any, idStateAd : number){
    let idAd = event.target.getAttribute("id") ;
    this.httpService.changeStateAd(idAd, idStateAd)
    .subscribe(res => {
      let answer : any = res;
      if(answer.isError == false){
        this.cleareList(idAd);
      }
      else{
       this.globalHub.addAlertMessage(new AlertMessage());
      }
    },
    err => {
      this.globalHub.addAlertMessage(new AlertMessage());
    }
  )}



  cleareList(idAd : number){
    let idAd_db = idAd;
    let index = 0; 
    let isBreak = false;
    for(let i = 0; i < this.adsCol.length; i++){
      for(let j = 0; j < this.adsCol[i].length; j++){ 
        if(this.adsCol[i][j].data.id == idAd_db){
          isBreak = true;
          break;
        }
        if(isBreak){
          break;
        }
        index++;
      }
    }

    let idCol = Math.floor( index / this.itemInRow );
    let idRow = index - idCol * this.itemInRow;

    let first = true;
    for(let i = idCol; i < this.adsCol.length; i++){
      for(let j = 0; j < this.adsCol[i].length; j++){ 
        if( j < idRow && first == true){
          continue;
        }
        first = false;
        
        if(j == this.itemInRow - 1 && i != this.adsCol.length - 1){
          this.adsCol[i][j] = this.adsCol[i + 1][0];
        }
        else{
          this.adsCol[i][j] = this.adsCol[i][j + 1];
        }        
      }
    }

  this.countAds--;
    if(this.countAds == 0){
      this.noAds = true;
    }
    let lastColIndes = Math.floor( this.countAds / this.itemInRow );
    this.adsCol[lastColIndes].pop();         
  }
}

