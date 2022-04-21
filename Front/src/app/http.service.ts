import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequCreateAd } from './Classes/Request/requ-create-ad';
import { RequEditAd } from './Classes/Request/requ-edit-ad';
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

  constructor(private http: HttpClient) 
  {
   
  }

  ngOnInit(): void {
  }

  // https://apijbs.azurewebsites.net
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
    return this.http.post( this.URL + "/User/login", JSON.stringify( data ), httpOptions )
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
    return this.http.post( this.URL + `/Ad/create?idUser=${reqData.idUser}&Title=${reqData.Title}
          &Describe=${reqData.Describe}
          &Brend=${reqData.Brend}
          &Category=${reqData.Category}
          &Price=${reqData.Price}`,
            data)
                .pipe( res => { return res; }, err => {return err} );
  }

  editAds( imgs: any, reqData : RequEditAd){
    return this.http.post(this.URL + `/Ad/EditAd?idAd=${reqData.idAd}
        &Title=${reqData.title}
        &Describe=${reqData.describe}
        &Price=${reqData.price}
        &idBrend=${reqData.idBrend}`,
          imgs)
          .pipe(res => {return res},err => {return err});
  }

  deleteAd(idAd : number){
    return this.http.delete(this.URL + `/Ad/DeleteAd?idAd=${idAd}`)
    .pipe( res => { return res; }, err => { return err } )
  }

  checkList(data : any){
    return this.http.post("https://localhost:44398/Ad/CheckListImg",data)
    .pipe(res => {return res;}, err => {return err}  )
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
      return this.http.get(this.URL + `/Img/GetMainImgAd?idAd=${idAd}`,{ responseType: 'blob' })
      .pipe(
        res => {
          return res
        },
        err =>{
          return err;
        }
      )
    }

    getOneAd(idAd : number){
        return this.http.get(this.URL + `/Ad/GetOneAd?idAd=${idAd}`)
        .pipe(
          res => {
            return res;
          },
          err => {
            return err;
          }
        )
    }

    GetImgOfAd(idAd : number, numberImg  : number){
      return this.http.get(this.URL + `/Img/GetImgsOfAd?idAd=${idAd}&numeberImg=${numberImg}`
      ,{ responseType: 'blob' })
      .pipe(
        res =>{
          return res;
        },
        err => {
          return err;
        }
      )
    }


    GetAdsPagination(page : number, idCat : number, idBrend : number){
      return this.http.get(this.URL + `/Ad/GetAdsPagination?pagePagination=${page}
      &idCategory=${idCat}
      &idBrend=${idBrend}`)
      .pipe(res => {
        return res;
      }, err => {
        return err;
      }
      )
    }

    GetVipAds(){
      return this.http.get(this.URL + "/VipAd/GetVipAds")
      .pipe( res => {
        return res;
      },
      err => {
        return err;
      }
       )
    }

}
