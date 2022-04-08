import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import axios, { Axios } from 'axios';
import { AuthUserResponse } from "src/app/Classes/auth-user-response";
import { RequCreateAd } from './Classes/Request/requ-create-ad';

import { catchError} from 'rxjs/operators';


import { HttpErrorResponse } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Response-Type' : 'json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {



  constructor(private http: HttpClient) { }

  // https://jbsapicors2.azurewebsites.net
//   https://localhost:44398
  private URL : string = "https://localhost:44398";

   getData() {
      const response = this.http.get("/api/auth/TestMeth");
      response.subscribe(res => console.log("Это ответ Get:" + res));
  }
  registerUser( data : object ){
        return this.http.post(this.URL + "/User/register", JSON.stringify( data ), httpOptions )
                      .pipe( res => { return res  }, 
                        catchError(err => {   
                          return err.message;
                      }) ) 
}

  authUser( data : object ){
    return this.http.post( this.URL + "/User/Login", JSON.stringify( data ), httpOptions )
                .pipe( res => { return res; },                
                  catchError(err => {   
                    return err.message;
                }) 
              )
            

            }

  confirmEmail(data : object){
      return this.http.post("/api/auth/confirm", JSON.stringify( data ), httpOptions )
                .pipe( res => { return res; }, err => { return err } ) ;
  }

  createAds(data : object, reqData : RequCreateAd  ){
    return this.http.post( this.URL + `/Ad/create?idUser=${reqData.idUser}
          &title=${reqData.Title}&describe=${reqData.Describe}`,
            data)
                .pipe( res => { return res; }, err => {return err} );
  }

  checkFileList(data : object){
    return this.http.post("https://localhost:44398/Ad/CheckListImg",
              data)
                .pipe( res => { return res; }, err => {return err} )
  }


}
