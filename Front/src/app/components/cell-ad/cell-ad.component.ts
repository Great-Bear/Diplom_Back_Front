import { Component, OnInit, Sanitizer } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

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
    this.ad.mainImg = "../assets/imgs/emptyImg.png";
  }

  loadMainImg(){
    this.http.getMainPicture(this.ad.id, this.ad.mainImg).subscribe(
      res => {         
       const urlToBlob = window.URL.createObjectURL(res)  
       this.ad.mainImg = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
    })
  }

  changeStateFavorite(event : any){

    if( isNaN(this.idUser) ){
      this.route.navigate(["/registration"])
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
    this.route.navigate([`/myfavorite/card-ad/${idAd}`]);
  }
}
