import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { CategoriesLayers } from './Classes/categories-layers';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalHubService {

  public isAnonim = new Subject<boolean>();
  public AnonimUser(state : boolean){
    this.isAnonim.next(state);
  }

  public isModer = new Subject<boolean>();
  public ModerUser(state : boolean){
    
    this.cookie.set("isModer",  String(state))
    this.isModer.next(state);
  }

  public categoriesLayers = new Subject<any>();
  public ChangeCatLayers(catsLay: any){
    this.categoriesLayers.next(catsLay);
  }

  public searchWord = new Subject<any>();
  public ChangeSearchWord(searchWord: any){
    this.searchWord.next(searchWord);
  }


  public startSearch = new Subject<any>();
  public StartSeachAction(){
    this.startSearch.next("");
  }

  constructor( private cookie : CookieService,
               private http: HttpService ) 
               {
                 this.http.getCategoriesLayer()
                 .subscribe(res => {
                   this.categoriesLayers.next(res);
                 })
               }

}
