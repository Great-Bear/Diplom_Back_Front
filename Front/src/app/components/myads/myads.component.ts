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

  public countPublishItem : any;

  private itemInRow = 4;

  constructor(
    private httpService : HttpService,
    private cookie : CookieService,
    private sanitizer: DomSanitizer,
    private route : Router
  ) {
  }

  ngOnInit(): void {
    this.httpService.getGetMyAds(this.cookie.get("idUser"))
    .subscribe(res => {
      if(res instanceof Array){
        
        if(res.length == 0){
          this.noAds = true;
          return;
        }
        this.countPublishItem = res.length;
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
   
            this.httpService.getMainPicture(indexItem, this.adsCol[colIndex][rowIndex] ).subscribe(
              res => {         
                console.log(res)
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

}
