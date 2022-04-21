import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalHubService {

  public isAnonim = new Subject<boolean>();

  public AnonimUser(state : boolean){
    this.isAnonim.next(state);
  }

  constructor() {}

}
