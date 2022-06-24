import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { CookieService  } from 'ngx-cookie-service'; 
import { TypeAd } from 'src/app/Classes/typeAd';
import { RequCreateAd } from 'src/app/Classes/Request/requ-create-ad';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  Title : string = "title ad";
  Describe : string = "describe ad";

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";
  private countImgs : number = 12;

  public requData : RequCreateAd = new RequCreateAd();
  public typeAd : TypeAd = new TypeAd();

  urlImgs : string[] = new Array(this.countImgs);
  cancelBts : boolean[] = new Array(this.countImgs);

  filterList = new Array();

  errMsg = {
    Title : "",
    Describe : "",
    Category : "",
    Filters : new Array(),
    Price : "",
    TypeAd : "",
    Quality : "",
    Phone : ""
  }

  phoneRegExp = new RegExp("[^0-9-]");
  priceRegExp = new RegExp("[^0-9]");


  currencies = [
    "грн",
    "$",
    "€",
  ]

  constructor(private httpService : HttpService,
              private cookieService : CookieService,
              private route : Router,
              private globalHub : GlobalHubService
              ) {

                this.requData.Currency = "1";

                this.requData.idUser = this.cookieService.get("idUser");

               for(let i = 0; i < this.urlImgs.length; i++){
                 this.urlImgs[i] = this.emptyImgUrl;
                 this.cancelBts[i] = false;
               }
               this.LoadCategoreis();
              }


  private LoadCategoreis(){
    if( !(this.globalHub.currentCatLayers.getValue() instanceof Array) ){
      this.globalHub.categoriesLayers.subscribe(res => {
        this.parseCatLayer(res);
      })
    }
    else{
      this.parseCatLayer(
        this.globalHub.currentCatLayers.getValue()
      );
    }
    }

    private parseCatLayer(carLayer : any){
    
      let catsList = new Array();
  
      for(let itemL3 of carLayer){
        for(let itemL2 of itemL3.data){
          let index = 0;
          for(let cat of itemL2.cat){
            let catItem = {
              name : cat,
              id : itemL2.idCat[index]
            }
             catsList.push(catItem);
             index++;
          }
        }
      }
      this.typeAd.Categories = catsList;
    }

  ngOnInit(): void {
  }

  FileSelected(event : any){
   
    let target = event.target;
    let nowLoadedFile = target.files;

     //  if ( !this.Imgs.type.startsWith("image/") ) {
    //    alert("Image only please....");
        //}

      let idLoadedImg = 0;
     for(let i = 0; i < this.urlImgs.length; i++){

      if(this.urlImgs[i] == this.emptyImgUrl){
        let reader = new FileReader();

        reader.onloadend = () => {  
          let urlImg : any = reader.result;     
          this.cancelBts[i] = true;  
          this.urlImgs[i] = urlImg;     
          };
          reader.readAsDataURL(nowLoadedFile[idLoadedImg]);           
          this.requData.Files.push(nowLoadedFile[idLoadedImg]);
          idLoadedImg++;
      }
      if(nowLoadedFile.length == idLoadedImg){
        return;
      }
    }
  }

  changeCat(event : any){
    this.httpService.getFilters(Number.parseInt(this.requData.Category))
    .subscribe(res => {
      this.filterList = new Array();
      this.errMsg.Filters = new Array();
      if(res instanceof Array){
        for(let filter of res){
          this.filterList.push(filter);
          this.errMsg.Filters.push("");
        }
      }   
      this.requData.FiltersValue = new Array(this.filterList.length);
    })
  }

  delImg(event: any){
    let indexUrl = event.target.getAttribute("id") as number;

    this.requData.Files.splice( indexUrl, 1 );

    for(; indexUrl < this.urlImgs.length;){     

      if( this.urlImgs[indexUrl] == this.emptyImgUrl ){
        this.cancelBts[indexUrl - 1] = false;
        break;
      }

      if(indexUrl == this.urlImgs.length - 1 ){
        this.urlImgs[indexUrl] = this.emptyImgUrl;
        this.cancelBts[indexUrl] = false;
        break;
      }   
        this.urlImgs[indexUrl] = this.urlImgs[++indexUrl]
      }  
  }

  findErrorForm(): Boolean {

    let isError = false;

    if(this.requData.Title.length == 0){
      this.errMsg.Title = "Заголовок не может быть пустым";
    }
    else{
      this.errMsg.Title = "";
    }

    if(this.requData.Describe.length == 0){
      this.errMsg.Describe = "Описание не может быть пустым";
    }
    else{
      this.errMsg.Describe = "";
    }

    if(this.requData.Phone.length <= 0){
      this.errMsg.Phone = "Номер телефона не может быть пустым";
    }
    else if(this.phoneRegExp.test(this.requData.Phone)){
      this.errMsg.Phone = "Некорректный номер телефона";
    }
    else{
      this.errMsg.Phone = "";
    }

    if(this.requData.Price.length <= 0){
      this.errMsg.Price = "Цена не может быть пустой";
    }
    else if (this.priceRegExp.test(this.requData.Price)){
      this.errMsg.Price = "Цена может состоять только из цифр"
    }
    else{
      this.errMsg.Price = "";
    }

   if(this.requData.Category == ""){
    this.errMsg.Category = "Выберете категорию";
   }
   else{
    this.errMsg.Category = "";
   }

   if(this.requData.TypeAd == ""){
     this.errMsg.TypeAd = "Выберете тип объявления";
   }
   else{
     this.errMsg.TypeAd = "";
   }

   if(this.requData.Quality == ""){
    this.errMsg.Quality = "Выберете состояние объявления";
  }
  else{
    this.errMsg.Quality = "";
  }

  let isFilterEmpty = false;

  if(this.filterList.length != 0){
    for(let i = 0; i < this.requData.FiltersValue.length; i++){
      if(this.requData.FiltersValue[i] == null){
        this.errMsg.Filters[i] = `Веберети ${this.filterList[i].filterName}`;
        isFilterEmpty = true;
      }
      else{
        this.errMsg.Filters[i] = "";
      }
    }
  }
    if(
      this.errMsg.Category.length > 0 ||
      this.errMsg.Describe.length > 0 ||
      this.errMsg.Quality.length > 0 ||
      this.errMsg.TypeAd.length > 0 ||
      this.errMsg.Title.length > 0 ||
      this.errMsg.Phone.length > 0 ||
      isFilterEmpty == true
      ){
        isError = true;
      }

    return isError;
  }

  CreateAds(){    

    if(this.findErrorForm() == true){

      let aMessage = new AlertMessage();
      aMessage.Title = "Некорректные данные :(";
      aMessage.Message = "Введите коректные данные для создания товара;"
      aMessage.TimeShow = 3000;

      this.globalHub.addAlertMessage(aMessage);

      return;
    }

    this.requData.idUser = this.cookieService.get("idUser");
    let form = new FormData();

      for(let i = 0; i < this.requData.Files.length; i++){
        form.append("filecollect", this.requData.Files[i] )
      }

      let filtersid = "";

      for(let i = 0; i < this.requData.FiltersValue.length; i++){
        filtersid += this.requData.FiltersValue[i]
        if(i != this.requData.FiltersValue.length - 1){
          filtersid += "|"
        }
      }

      this.httpService.createAds(form,filtersid, this.requData).subscribe(res => {
        let response : any = res;
        if(response.isError){
          let aMessage = new AlertMessage();
          aMessage.Title = "Ошибка создания :(";
          aMessage.Message = "Сервер не смог создать объявление"
          aMessage.TimeShow = 3000;
          this.globalHub.addAlertMessage(aMessage);
          return;
        }
          this.route.navigate([`/card-ad/${response.idAd}`]);
      }, err => {
        let aMessage = new AlertMessage();
        aMessage.Title = "Ой что-то пошло не так :(";
        aMessage.Message = "В этом нет вашей вины, попробуйте повторить попытку позже";
        aMessage.TimeShow = 3000;
        this.globalHub.addAlertMessage(aMessage);
      });
  }
}
