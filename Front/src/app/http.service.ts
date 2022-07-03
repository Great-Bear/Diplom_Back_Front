import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequCreateAd } from './Classes/Request/requ-create-ad';
import { RequEditAd } from './Classes/Request/requ-edit-ad';
import { catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';


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
  private URL : string = " https://localhost:44398";

  registerUser( data : object ){
        return this.http.post(this.URL + "/User/register", JSON.stringify( data ), httpOptions )
                .pipe( 
                    res => 
                    { 
                      return res
                    }, 
                    err => {   
                      return err;
                });
}



  authUser( data : object ){
    return this.http.post( this.URL + "/User/login", JSON.stringify( data ), httpOptions )
                .pipe( res => { return res; },                
                      err => {
                        return err;
                      }
              )
            }

  confirmEmail(data : object){
      return this.http.post( this.URL + "/User/confirmEmail", JSON.stringify( data ), httpOptions )
                .pipe( res => { return res; }, err => { return err } ) ;
  }

  resetPasswd(data : object ){
    console.log(data);
    return this.http.post(this.URL + "/User/ResetPasswd", data)
    .pipe( res => {
      return res;
    }, err => {
      return err;
    })
  }

  getIdChat(idBuyer : number, idAd : number){
    return this.http.get(this.URL + `/Chat/GetIdChat?idBuyer=${idBuyer}&idAd=${idAd}`)
      .pipe(
        res => {
          return res;
        },
        err => {
          return err;
        }
      )
  }

  createChat(idBuyer : number, idAd : number){

    let body =
    {
      "idBuyer": idBuyer,
      "idAd": idAd
    }

    return this.http.put(this.URL + "/Chat/CreateChat", body)
    .pipe( res => {
      return res;
    },
    err => {
      return err;
    }
    )
  }

  createMsg(body : any){
    return this.http.put(this.URL + "/MsgChat/CreateMsg",body)
    .pipe(res => {
      return res;
    },
    err => {
      return err;
    })
  }

  getMsgChat(idChat : number){
    return this.http.get(this.URL + `/Chat/MsgChat?idChat=${idChat}`)
    .pipe( res => {
      return res;
    }, err => {
      return err;
    } )
  }

  getMyChats(idUser : number){
    return this.http.get(this.URL + `/Chat/MyChats?idUser=${idUser}`)
    .pipe( res => {
      return res;
    }, err => {
      return err;
    })
  }

  getNewMsgChat(idLastMsg : number, idChat : number, idUser : number){
    return this.http.get(this.URL + `/Chat/GetNewMsgChat?idLastMsg=${idLastMsg}&idChat=${idChat}&idUser=${idUser}`)
    .pipe( res => {
      return res;
    }, err => {
      return err;
    } )
  }

  getUnreadChatCount(idUser : number){
    return this.http.get(this.URL + `/Chat/GetUnreadChatCount?idUser=${idUser}`)
    .pipe(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  readMsg(idMsg : number){
    let body = new Object();

    return this.http.put(this.URL + `/MsgChat/ReadMsg?idMsg=${idMsg}`, body)
    .pipe( res => {
      return res;
    }, err => {
      return err;
    } )
  }

  createAds(data : any, filtersid : any, reqData : RequCreateAd  ){
    return this.http.post( this.URL + `/Ad/create?idUser=${reqData.idUser}&Title=${reqData.Title}&Describe=${reqData.Describe}&Category=${reqData.Category}&Price=${reqData.Price}&Phone=${reqData.Phone}&IsDelivery=${reqData.IsDelivery}&isNegotiatedPrice=${reqData.isNegotiatedPrice}&Quality=${reqData.Quality}&TypeAd=${reqData.TypeAd}&CurrencyId=${reqData.Currency}&FiltersValue=${filtersid}
          `,         
            data)
                .pipe( res => { return res; }, err => {return err} );
  }

  list_adsGetByPagin(pagePagin:number, stepPagin : number,idcatL3 : number, idcatL2:number,  idCat : number ,idQuality : number,isDel : boolean, priceMin : number, priceMax : number
    ,searchWord : any,idCurrency : number,arrOrderByValue : Array<number>, arrFilters : any){

    let filtersValueContainer = {
      maxValue : "2",
      minValue : "3",
      userSlider: false,
      values : new Array()
    }

    filtersValueContainer.values.push("str")

    let arr = new Array();
    arr.push(filtersValueContainer);

    let orderByValue = "";
    for(let i = 0; i < arrOrderByValue.length; i++){
      orderByValue += arrOrderByValue[i];
      if(i != arrOrderByValue.length - 1){
        orderByValue += "|";
      }
    }

    return this.http.post( this.URL +
       `/List_Ads/GetAdsPagination?pagePagination=${pagePagin}&stepPagin=${stepPagin}&idCategoryL2=${idcatL2}&idCategoryL3=${idcatL3}&idCategory=${idCat}&idQuality=${idQuality}&idDel=${isDel}&priceFrom=${priceMin}&searchWord=${searchWord}&idCurrency=${idCurrency}&priceBefore=${priceMax}&orderBy=${orderByValue}`
       , arrFilters)
       .pipe( res => {
         return res;
       },
       err => {
         return err;
       } )
  }

  updateFavorite(idUser : number,
                 idAd : number,
                 addToFavorit : boolean){
    let body = "";

    return this.http.post(this.URL + `/Favorite/AddFovarite?idUser=${idUser}&idAd=${idAd}&adToFavorite=${addToFavorit}`,
     body)
     .pipe(
       res => {
         return res;
       },
       err => {
         return err;
       }
     )
  }

  deleteModer(data : any){
    return this.http.delete( this.URL + `/Moder/DeleteModer?id=${data.id}`)
    .pipe( res => {
      return res;
    }, err => {
      return err;
    });
  }

  addModer(data : any){
    return this.http.post(this.URL + "/Moder/AddModer", data)
    .pipe(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  loadModers(){
   return this.http.get(this.URL + "/Moder/GetAllModers")
    .pipe( 
      res => {
        return res;
      },
      err => {
        return err;
      }
     )
  }

  getFavoriteAd(idUser : number){

    return this.http.get(this.URL + `/Favorite/GetFovarites?idUser=${idUser}`)
    .pipe(res => {
      return res;
    },
    err => {
      return err;
    }
    )
  }

 

  getCountFavoriteAd(idUser : number){
    return this.http.get(this.URL + `/Favorite/GetCountFovarites?idUser=${idUser}`)
    .pipe(res => {
      return res;
    },
    err => {
      return err;
    }
    )
  }

  editAds( imgs: any, filterStringValue : any, reqData : RequEditAd){  
    return this.http.post(this.URL + `/Ad/EditAd?idAd=${reqData.idAd}&idCurrency=${reqData.idCurrency}&Title=${reqData.title}&Describe=${reqData.describe}&Price=${reqData.price}&Phone=${reqData.Phone}&IsDelivery=${reqData.IsDelivery}&isNegotiatedPrice=${reqData.isNegotiatedPrice}&filtersValue=${filterStringValue}`,
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
  getWaitingAds(){
    return this.http.get(this. URL + "/Ad/GetWaitingAds")
    .pipe( res => {
      return res;
    },
    err => {
      return err;
    } 
  )
  }

  changeStateAd(idAd : number, state : number){
    let body;
    return this.http.put(this.URL + `/Ad/ChangeStatAd?idAd=${idAd}&newStat=${state}`,body)
    .pipe(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  getFilters(catId : number){
    return this.http.get(this.URL + `/Filter/GetFilters?idCat=${catId}`)
    .pipe(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  isFavoriteAd(idAd : number, idUser : number){
    return this.http.get( this.URL + `/Favorite/IsFavoriteAds?idUser=${idUser}&idAd=${idAd}`)
    .pipe(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }


  getCategoriesLayer()
  {
   return this.http.get(this.URL + "/Tools/LayersCategories")
    .pipe(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }

  getGetMyAds(idUser : any, statusId : number){
      return this.http.get(this.URL + `/Ad/MyAds?idUser=${idUser}&statusId=${statusId}`)
      .pipe(
        res => {
          return res
        },
        err => {
            return err;
        }
      );
    }

    getGetMyAdsFavorite(idUser : any){
      return this.http.get(this.URL + `/Favorite/MyAdsFavorite?idUser=${idUser}`)
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

    getPopularAds(page : number){
      return this.http.get( this.URL + `/Ad/PopularAds?pagePagination=${page}`)
      .pipe( res => {
        return res;
      }, err => {
        return err;
      } )
    }

    getRecommendedAds(page : number,  idUser : number){
      return this.http.get(this.URL + `/Ad/RecommendedAds?pagePagination=${page}&idUser=${idUser}`)
      .pipe( res => {
        return res;
      }, err => {
        return err;
      } )
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

    populateDB(){
      let body = {
        fsdf : 1
      }

      return this.http.put( "https://apijbs.azurewebsites.net" + "/Tools/PopulateDb",body)
      .pipe( res => {return res }
        ,err => {
          return err
        })
    }

    loadSameWords(word : string){
      return this.http.get(this.URL + `/Tools/SameWords?word=${word}`)
      .pipe(res => {
        return res;
      }, err => {
        return err;
      })
    }
}
