import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-favorite',
  templateUrl: './my-favorite.component.html',
  styleUrls: ['./my-favorite.component.css']
})
export class MyFavoriteComponent implements OnInit {

  
  private emptyImgUrl  = "../assets/imgs/emptyImg.png";
 
  public adsCol = Array();
  public noAds : boolean = false

  private itemInRow = 4;

  constructor(
    private httpService : HttpService,
    private cookie : CookieService,
    private sanitizer: DomSanitizer,
    private route : Router
  ) {
  }

  ngOnInit(): void {
   this.loadAds();
  }

  loadAds(){
    this.adsCol = new Array();

    this.httpService.getGetMyAdsFavorite(this.cookie.get("idUser"))
    .subscribe(ans => {
      let res : any  = ans;

      console.log(ans);

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
              data : res[indexItem].ad,
              url : this.emptyImgUrl
            });
            indexItem++;
   
            this.httpService.getMainPicture(res[indexItem - 1].ad.id, this.adsCol[colIndex][rowIndex] ).subscribe(
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
}
