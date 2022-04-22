import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-myads',
  templateUrl: './myads.component.html',
  styleUrls: ['./myads.component.css']
})


export class MyadsComponent implements OnInit {

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";
 
  public adsCol = Array();
  public noAds : boolean = false

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
    private route : Router
  ) {
  }

  ngOnInit(): void {
   this.loadAds(null,3);
  }

  loadAds(event : any,statusAd : number){
    if(event == null){
      this.nowActivePage = 0;
    }
    else{
      this.nowActivePage  = event.target.id;
    }

    this.adsCol = new Array();

    this.httpService.getGetMyAds(this.cookie.get("idUser"), statusAd)
    .subscribe(ans => {
      let res : any  = ans;

      for(let i = 0; i < this.arrCountsItem.length; i++){
        this.arrCountsItem[i] = res.countsItem[i];
      }

      res = res.ads;
      if(res instanceof Array){
        
        if(res.length == 0){
          this.noAds = true;
          return;
        }
        else{
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
        console.log("Ошибка сервера");
      }
    })
  }

  watchAd(event : any){
    this.route.navigate([`/card-ad/${event.target.getAttribute("id")}`]);
  }

  editAd(event : any){
    this.route.navigate([`/edit-ad/${event.target.getAttribute("id")}`]);
  }

  deleteAd(event : any){
    let isDelete = confirm("Вы хотите удалить объявление?");
    if(isDelete){
      console.log(this.adsCol);
      this.httpService.deleteAd(event.target.getAttribute("id"))
      .subscribe(res => {
        let answer : any = res;
        if(answer.isError == false){
          this.adsCol[ Math.ceil( this.adsCol.length / this.itemInRow ) ]
        }
      })

      let idAd_db = Number.parseInt(event.target.getAttribute("id") );
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

      this.arrCountsItem[this.nowActivePage]--;
      if(this.arrCountsItem[this.nowActivePage] == 0){
        this.noAds = true;
      }
      let lastColIndes = Math.floor( this.arrCountsItem[this.nowActivePage] / this.itemInRow );
      this.adsCol[lastColIndes].pop();         
    }
  }
}
