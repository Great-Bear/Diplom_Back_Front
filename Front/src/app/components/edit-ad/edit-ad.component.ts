import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { CookieService  } from 'ngx-cookie-service'; 
import { TypeAd } from 'src/app/Classes/typeAd';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RequEditAd } from 'src/app/Classes/Request/requ-edit-ad';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';

@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.component.html',
  styleUrls: ['./edit-ad.component.css']
})
export class EditAdComponent implements OnInit {

  Title : string = "title ad";
  Describe : string = "describe ad";

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  private countImgs : number = 12;

  public Category : any;
  public idBrend : number = 0;

  public catList = new Array();

  public requData : any;

  public typeAd : TypeAd = new TypeAd();

  public forLoadFiles : File[] =  Array();

  phoneRegExp = new RegExp("[^0-9-]");
  priceRegExp = new RegExp("[^0-9]");

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

  currencies = [
    "грн",
    "$",
    "€",
  ]



  filterList = new Array();

  urlImgs = new Array(this.countImgs);
  cancelBts : boolean[] = new Array(this.countImgs);


  constructor(private httpService : HttpService,
              private cookieService : CookieService,
              private activateRoute : ActivatedRoute,
              private sanitizer: DomSanitizer,
              private route : Router,
              private globalHub : GlobalHubService) {

                let idAd = this.activateRoute.snapshot.params['id'];
                this.LoadCategoreis();

                for(let i = 0; i < this.countImgs; i++){
                  this.urlImgs[i] = this.emptyImgUrl;
                  this.cancelBts[i] = false;
                }

                this.httpService.getOneAd(idAd).subscribe(
                  res => {
                    let response : any = res;
                    console.log(res);
              
                    if(response.IsError == true){
                      this.globalHub.addAlertMessage(new AlertMessage());
                      return;
                    }

                    this.Category = this.catList.find( c => c.id == response.data.idCategory ).name; 

                    this.requData = response.data;
                    let filteList_Db : any = res;

                    this.requData.FiltersValue = new Array();
                    for(let itemFilter of filteList_Db.data.filter_Ads){
                      this.requData.FiltersValue.push(itemFilter);
                    }


                    this.httpService.getFilters(Number.parseInt(this.requData.idCategory))
                    .subscribe(res => {
                      this.filterList = new Array();
                      if(res instanceof Array){
                        for(let filter of res){
                          this.filterList.push(filter);
                        }
                      }               
                    })

                    this.countImgs = this.requData.countImgs;

                    this.requData.price = Number.parseFloat(this.requData.price);

                    for(let i = 0; i < this.countImgs; i++){
                      this.httpService.GetImgOfAd(idAd, i).subscribe(
                        imgBlob => {
                          const urlToBlob = window.URL.createObjectURL(imgBlob)  
                          this.urlImgs[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);
                          this.cancelBts[i] = true;

                          let b2 = new Blob([imgBlob as BlobPart], { type: imgBlob.type });
                          let file : any = b2;
                          file.lastModified = Date.now.toString();
                          file.name = "application.png";
                          file.webkitRelativePathts = "";
                          this.forLoadFiles[i] = file;                         
                        }
                      )
                    }  
                  }
                )
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
      this.catList = catsList;
    }

  ngOnInit(): void {
  }

  FileSelected(event : any){
   
    let target = event.target;
    let nowLoadedFile = target.files;

//       if ( !this.Imgs.type.startsWith("image/") ) {
  //      alert("Image only please....");
    //    }

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
          this.forLoadFiles.push(nowLoadedFile[idLoadedImg]);
          idLoadedImg++;
      }
      if(nowLoadedFile.length == idLoadedImg){
        return;
      }
    }
  }

  delImg(event: any){
    let indexUrl = event.target.getAttribute("id") as number;

    this.forLoadFiles.splice( indexUrl, 1 );

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

    if(this.requData.title.length == 0){
      this.errMsg.Title = "Заголовок не може бути порожнім";
    }
    else{
      this.errMsg.Title = "";
    }

    if(this.requData.describe.length == 0){
      this.errMsg.Describe = "Опис не може бути порожнім";
    }
    else{
      this.errMsg.Describe = "";
    }

    if(this.requData.phoneNumber.length <= 0){
      this.errMsg.Phone = "Номер телефону не може бути порожнім";
    }
    else if(this.phoneRegExp.test(this.requData.phoneNumber)){
      this.errMsg.Phone = "Некоректний номер телефону";
    }
    else{
      this.errMsg.Phone = "";
    }

    if(this.requData.price.length <= 0){
      this.errMsg.Price = "Ціна не може бути порожньою";
    }
    else if (this.priceRegExp.test(this.requData.price)){
      this.errMsg.Price = "Ціна може складатися лише з цифр"
    }
    else{
      this.errMsg.Price = "";
    }

   if(this.requData.category == ""){
    this.errMsg.Category = "Виберіть категорію";
   }
   else{
    this.errMsg.Category = "";
   }

   if(this.requData.typeAd == ""){
     this.errMsg.TypeAd = "Виберіть тип оголошення";
   }
   else{
     this.errMsg.TypeAd = "";
   }

   if(this.requData.quality == ""){
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




  EditAds(){    
    console.log(this.requData)
    if(this.findErrorForm() == true){

      let aMessage = new AlertMessage();
      aMessage.Title = "Некоректні дані :(";
      aMessage.Message = "Введіть коректні дані для створення товару;"
      aMessage.TimeShow = 3000;

      this.globalHub.addAlertMessage(aMessage);

      return;
    }



    this.requData.idUser = this.cookieService.get("idUser");


    let form = new FormData();

      for(let i = 0; i < this.forLoadFiles.length; i++){
        form.append("filecollect", this.forLoadFiles[i] )
      }

      let reqData : RequEditAd =  new RequEditAd();
      reqData.title = this.requData.title;
      reqData.describe = this.requData.describe;
      reqData.price = this.requData.price;
      reqData.idAd = this.activateRoute.snapshot.params['id'];
      reqData.Phone =  this.requData.phoneNumber;
      reqData.IsDelivery =  this.requData.isDelivery;
      reqData.isNegotiatedPrice =  this.requData.isNegotiatedPrice;
      reqData.idCurrency = this.requData.idCurrency;

      let filterStringValue = "";
      for(let i = 0; i < this.requData.FiltersValue.length; i++ ){
        filterStringValue += this.requData.FiltersValue[i];
          if(i != this.requData.FiltersValue.length - 1){
            filterStringValue += "|";
          }
      }
      this.httpService.editAds(form,filterStringValue, reqData).subscribe(res => {
       if(res == true){
        this.route.navigate([`/card-ad/${reqData.idAd}`]);
       }
      }, err => {
        console.log(err);
      }); 

  }


}
