import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import axios, { Axios } from 'axios';
import { AuthUserResponse } from "src/app/Classes/auth-user-response";
import { RequCreateAd } from './Classes/Request/requ-create-ad';

import { catchError} from 'rxjs/operators';


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

  cashCategory : string[] = new Array();

  constructor(private http: HttpClient) 
  {
   
  }

  ngOnInit(): void {
    const sbr =  this.http.get(this.URL + "/Tools/categories").pipe(
      res => { return res }, err => { return err })
      sbr.subscribe( res => {
        if(res instanceof Array){
          this.cashCategory = res;
          console.log( this.cashCategory );
        }
      } )
  }

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

  createAds(data : any, reqData : RequCreateAd  ){
console.log(data);
    return this.http.post( this.URL + `/Ad/create?idUser=${reqData.idUser}&Title=${reqData.Title}
          &Describe=${reqData.Describe}
          &Brend=${reqData.Brend}
          &Category=${reqData.Category}
          &Price=${reqData.Price}`,
            data)
                .pipe( res => { return res; }, err => {return err} );
  }

  getCategories(){
    return this.http.get( this.URL + "/Tools/categories").pipe(
      res => { return res }, err => {return err}
    )
  }
  getBrands(){
    return this.http.get( this.URL + "/Tools/brends").pipe(
      res => { return res }, err => {return err}
    )
  }

  getGetMyAds(idUser : any){
      return this.http.get(this.URL + `/Ad/MyAds?idUser=${idUser}`)
      .pipe(
        res => {
          return res
        },
        err => {
            return err;
        }
      );
    }

    getMainPicture(idAd : number, container : any) {
      return this.http.get(this.URL + `/GetMainImgAd?idAd=${idAd}`,{ responseType: 'blob' })
      .pipe(
        res => {
          return res
        },
        err =>{
          return err;
        }
      )
    }
}
