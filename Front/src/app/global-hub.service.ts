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
    this.isAnonim.next(state);
  }

  public isModer = new Subject<boolean>();
  public ModerUser(state : boolean){
    
    this.cookie.set("isModer",  String(state))
    this.isModer.next(state);
  }

  public categoriesLayers = new Subject<any>();
  public currentCatLayers = new BehaviorSubject({});

  public ChangeCatLayers(catsLay: any){
    this.categoriesLayers.next(catsLay);
    this.currentCatLayers.next(catsLay);
  }

  public searchWord = new Subject<any>();
  public ChangeSearchWord(searchWord: any){
    this.searchWord.next(searchWord);
  }


  public startSearch = new Subject<any>();
  public StartSeachAction(){
    this.startSearch.next("");
  }


  public AlertMessage = new Subject<any>();
  public addAlertMessage(message : AlertMessage){
    this.AlertMessage.next(message);
  }

  constructor( private cookie : CookieService,
               private http: HttpService ) 
               {
                 this.http.getCategoriesLayer()
                 .subscribe(res => {
                   this.ChangeCatLayers(res);
                 })
               }

}
