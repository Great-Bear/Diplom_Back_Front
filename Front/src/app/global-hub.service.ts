import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { CategoriesLayers } from './Classes/categories-layers';
import { HttpService } from './http.service';
import { BehaviorSubject } from 'rxjs';
import { AlertMessage } from './Classes/alert-message';

@Injectable({
  providedIn: 'root'
})
export class GlobalHubService {

  public isAnonim = new Subject<boolean>();
  public currentisAnonim = new BehaviorSubject({});
  public AnonimUser(state : boolean){
    this.isAnonim.next(state);
  }

  public isModer = new Subject<boolean>();
  public ModerUser(state : boolean){
    
    if(state){
      this.cookie.set("isModer",  String(state))
    }
    else{
      this.cookie.set("isModer", "")
    }
    this.isModer.next(state);
  }

  public isAdmin = new Subject<boolean>();
  public AdminUser(state : boolean){
    
    if(state){
      this.cookie.set("isAdmin",  String(state))
    }
    else{
      this.cookie.set("isAdmin", "")
    }
    this.isAdmin.next(state);
  }

  public categoriesLayers = new Subject<any>();
  public currentCatLayers = new BehaviorSubject({});

  public ChangeCatLayers(catsLay: any){
    this.categoriesLayers.next(catsLay);
    this.currentCatLayers.next(catsLay);
  }

  public brends = new Subject<any>();
  public currentbrends = new BehaviorSubject({});

  public ChangeBrends(catsLay: any){
    this.brends.next(catsLay);
    this.currentbrends.next(catsLay);
  }

  public searchWord = new Subject<any>();
  public ChangeSearchWord(searchWord: any){
    this.searchWord.next(searchWord);
  }

  public listModers = new Subject<any>();
  public UpdateListModers(){
    this.listModers.next(true);
  }


  public startSearch = new Subject<any>();
  public StartSeachAction(){
    this.startSearch.next("");
  }


  public AlertMessage = new Subject<any>();
  public addAlertMessage(message : AlertMessage){
    this.AlertMessage.next(message);
  }

  public countFavoriteAd = new BehaviorSubject(0)
  public changeCountFavoriteAd(value : number){
    console.log("From favorite value" + value);
    this.countFavoriteAd.next(    
       this.countFavoriteAd.getValue() + value
    )
  }

  public SetCoutFavoriteAd(value : number){
    this.countFavoriteAd.next(value)
  }


  constructor( private cookie : CookieService,
               private http: HttpService ) 
               {
               }

}
