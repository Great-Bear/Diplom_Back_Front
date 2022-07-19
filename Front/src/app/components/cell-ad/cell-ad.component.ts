import { Component, OnInit, Sanitizer } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/Classes/alert-message';

@Component({
  selector: 'app-cell-ad',
  templateUrl: './cell-ad.component.html',
  styleUrls: ['./cell-ad.component.css']
})
export class CellAdComponent implements OnInit {

  @Input() ad: any ;
  idUser : number = 0;

  constructor(
    private http : HttpService,
    private sanitizer : DomSanitizer,
    private cookie : CookieService,
    private globalHub : GlobalHubService,
    private route : Router
  ) 
  {
    this.idUser = Number.parseInt( this.cookie.get("idUser") );
  }

  ngOnInit(): void {
    this.loadMainImg();
    this.ad.mainImg = "";
  }

  loadMainImg(){
    this.http.getMainPicture(this.ad.id, this.ad.mainImg).subscribe(
      res => {         
       const urlToBlob = window.URL.createObjectURL(res)  
       this.ad.mainImg = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
    })
  }

  changeStateFavorite(event : any){
    event.stopPropagation();

    let aMessage = new AlertMessage();

    if( isNaN(this.idUser) ){
        
      aMessage.Title = "Попередження"
      aMessage.Message ="Щоб додати оголошення в вибране будь ласка авторизуйтеся";
      aMessage.TimeShow = 4000;

      this.globalHub.addAlertMessage(aMessage);
      return;
    }


    event.stopPropagation();
    this.ad.isFavorit = !this.ad.isFavorit;


    this.http.updateFavorite(this.idUser, this.ad.id, this.ad.isFavorit)
    .subscribe(res => {
      let response : any = res;
      if(response.isError){
        this.ad.isFavorit = !this.ad.isFavorit;     
        return;  
      }
      let valueCountFavorite = this.ad.isFavorit ? 1 : -1;
      this.globalHub.changeCountFavoriteAd(valueCountFavorite);
    }, err => {
      this.ad.isFavorit = !this.ad.isFavorit;
    })
  }

  watchAd(idAd : number){
    this.route.navigate([`/${this.route.url}/card-ad/${idAd}`]);
  }
}
