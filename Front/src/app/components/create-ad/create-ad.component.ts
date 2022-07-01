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

  public catListL2 = new Array();
  public catListL3 = new Array();

  public choiceCatList3 = new Array();

  valueL3  = "";
  valueL2  = "";

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

    choiceCatL3(event : any){
      this.catListL2 =  new Array();

      let index = 0;
      for(let cat of this.catListL3[event.target.value].data){
        if(cat.cat.length > 0 ){
          this.catListL2.push(cat)
        }
        index++;
      }

      this.typeAd.Categories =  new Array();
      this.filterList = new Array();
      this.requData.Category = "";
      this.valueL2 = "";

    }
    choiceCatL2(event : any){
      this.typeAd.Categories = new Array();

      let index = 0;
      for(let cat of this.catListL2[event.target.value].cat){
        let catItem = {
          name : cat,
          id : this.catListL2[event.target.value].idCat[index]
        }
        this.typeAd.Categories.push(catItem);
        index++;
      }

      this.filterList = new Array();
      this.requData.Category = "";

    }

    private parseCatLayer(carLayer : any){
    
      let catsList = new Array();
      this.catListL3 ;
  
      for(let itemL3 of carLayer){

        if(itemL3.data.length > 0){
          this.catListL3.push(itemL3);
        }

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

  getCountLoadedImgs() : number {
    let countImgs = 0;
    for(let img of this.urlImgs){
      if(img != this.emptyImgUrl){
        countImgs++;
      }
    }
    return countImgs;
  }

  FileSelected(event : any){
   
    let target = event.target;
    let nowLoadedFile = target.files as FileList;
    
    if(this.getCountLoadedImgs() + nowLoadedFile.length > this.countImgs){
      let aMessage = new AlertMessage();
          aMessage.Title = "Попередження";
          aMessage.Message = `Максимальна кількість зображень ${this.countImgs}`;
          aMessage.TimeShow = 4000;
          this.globalHub.addAlertMessage(aMessage);
    }

      for(let i = 0; i < nowLoadedFile.length; i++){
        if( !nowLoadedFile[i].type.startsWith("image/") ){
          let aMessage = new AlertMessage();
          aMessage.Title = "Попередження";
          aMessage.Message = "Можна завантажити лише зображення";
          aMessage.TimeShow = 4000;
          this.globalHub.addAlertMessage(aMessage);
          return;
        }
      }

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
      this.errMsg.Title = "Заголовок не може бути порожнім";
    }
    else{
      this.errMsg.Title = "";
    }

    if(this.requData.Describe.length == 0){
      this.errMsg.Describe = "Опис не може бути порожнім";
    }
    else{
      this.errMsg.Describe = "";
    }

    if(this.requData.Phone.length <= 0){
      this.errMsg.Phone = "Номер телефону не може бути порожнім";
    }
    else if(this.phoneRegExp.test(this.requData.Phone)){
      this.errMsg.Phone = "Некоректний номер телефону";
    }
    else{
      this.errMsg.Phone = "";
    }

    if(this.requData.Price.length <= 0){
      this.errMsg.Price = "Ціна не може бути порожньою";
    }
    else if (this.priceRegExp.test(this.requData.Price)){
      this.errMsg.Price = "Ціна може складатися лише з цифр"
    }
    else{
      this.errMsg.Price = "";
    }

   if(this.requData.Category == ""){
    this.errMsg.Category = "Виберіть категорію";
   }
   else{
    this.errMsg.Category = "";
   }

   if(this.requData.TypeAd == ""){
     this.errMsg.TypeAd = "Виберіть тип оголошення";
   }
   else{
     this.errMsg.TypeAd = "";
   }

   if(this.requData.Quality == ""){
    this.errMsg.Quality = "Виберіть стан оголошення";
  }
  else{
    this.errMsg.Quality = "";
  }

  let isFilterEmpty = false;

  if(this.filterList.length != 0){
    for(let i = 0; i < this.requData.FiltersValue.length; i++){
      if(this.requData.FiltersValue[i] == null){
        this.errMsg.Filters[i] = `Виберіть ${this.filterList[i].filterName}`;
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
      aMessage.Title = "Некоректні дані :(";
      aMessage.Message = "Введіть правильні дані для створення товару"
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
          aMessage.Title = "Помилка створення :(";
          aMessage.Message = "Сервер не зміг створити оголошення"
          aMessage.TimeShow = 3000;
          this.globalHub.addAlertMessage(aMessage);
          return;
        }
          this.route.navigate([`/card-ad/${response.idAd}`]);
      }, err => {
        let aMessage = new AlertMessage();
        aMessage.Title = "Ой щось пішло не так :(";
        aMessage.Message = "У цьому немає вашої провини, спробуйте повторити спробу пізніше";
        aMessage.TimeShow = 3000;
        this.globalHub.addAlertMessage(aMessage);
      });
  }
}
