import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

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

  constructor( private cookie : CookieService ) {}

}
