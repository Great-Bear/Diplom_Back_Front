import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-favorite',
  templateUrl: './my-favorite.component.html',
  styleUrls: ['./my-favorite.component.css']
})
export class MyFavoriteComponent implements OnInit {

  public arrAds = new Array();
  public noAds : boolean = false
  public isLoadItem = true;
  idUser : number = 0;

  constructor(
    private httpService : HttpService,
    private cookie : CookieService,
    private globalHub : GlobalHubService
  ) {
    this.idUser = Number.parseInt(cookie.get("idUser"));
  }

  ngOnInit(): void {
   this.loadAds();
  }

  loadAds(){
    this.isLoadItem = true;
    this.httpService.getGetMyAdsFavorite(this.cookie.get("idUser"))
    .subscribe(ans => {
      let res : any  = ans;
      this.isLoadItem = false;
      if(res.isError){
        this.globalHub.addAlertMessage(new AlertMessage());
        return;
      }
      this.arrAds = res.ads;     
      this.noAds = res.length == 0 ? true : false;
    }, err => {
      this.globalHub.addAlertMessage(new AlertMessage());
    })
  }

  choiceSubMenu(event : any){
    if(event.target == event.currentTarget){
      return;
    }
    let previousChoice  = document.getElementById("choicedSubMenuNav");
    if(previousChoice != null){
      event.target.id = previousChoice.id;
      previousChoice.setAttribute("id","");
    }
  }

  deleteAllFavorites(){
    let isConfirm = confirm("Дійсно видалити всі товари з вибраних?");
    if(isConfirm){
      for(let item of this.arrAds){
        item.ad.isFavorite = false;
        this.httpService.updateFavorite(this.idUser, item.ad.id, false)
        .subscribe( res => {
          let response : any = res;
          if(response.isError){
            this.globalHub.addAlertMessage(new AlertMessage());
            item.ad.isFavorite = true;
          }
          this.globalHub.changeCountFavoriteAd(-1);
        }, err => {
          this.globalHub.addAlertMessage(new AlertMessage());
        })
      }
    }
  }
}
