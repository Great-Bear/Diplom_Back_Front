import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterValueContainer } from 'src/app/Classes/Request/filter-value-container';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { MetaController } from 'src/app/Classes/meta-controller';


@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrls: ['./list-ads.component.css']
})
export class ListAdsComponent implements OnInit {

  carLayer = new Array();
  catsList = new Array();
  catsListMarker = new Array();

  catId = 0;
  catIdL2 = 0;
  catidL3 = 0;
  QualityId = 0;
  isDelivery = false;

  priceMin = 0;
  priceMax = 0;

  isNewMinMaxPrice = true;

  searchWord = "";

  isLoadItem = true;

  filters = new Array();

  adsCollect = new Array();
  imgCollect = new Array();

  orderByDate = -1;
  orderByPrice = 0;
  orderByrandom = 0;

  arrOrderByValue = Array();

  numbersExp : RegExp = new RegExp("[0-9_]");

  isPlitcaShow = false;
  isNoAds = false;

  choiceCatValue : string = "Всі категорії";
  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  isDropListCat = true;
  isScrollListCat = true;
  stepPagin : number = 10;
  countItemFilter = Array();

  idCurrency = 0;

  arrfiltersValueContainer = new Array();

  metaController = new MetaController();

  constructor(private http : HttpService,
              private globalHub : GlobalHubService,
              private sanitizer: DomSanitizer,
              private activateRoute: ActivatedRoute,
              private route : Router,
              private cookie : CookieService,
               ) 
  { 

    this.countPage = new Array();
    for(let i = 1 ; i <= 15; i++){
      this.countPage.push(i);
    }
    this.UpdatePagination();

   this.catidL3 = activateRoute.snapshot.params['idCategory'];
   let queryStr = activateRoute.snapshot.params['searchQuery'];

   if(queryStr != undefined){
     this.searchWord = queryStr;
   }

   if(this.catidL3 == undefined){
     this.catidL3 = 0;
   }

   this.carLayer = new Array();
   this.arrOrderByValue.push(this.orderByDate);
   this.arrOrderByValue.push(this.orderByPrice);
   this.arrOrderByValue.push(this.orderByrandom);

    this.globalHub.searchWord.subscribe( searchWord => {
      this.searchWord = searchWord;
    } );

    this.globalHub.startSearch.subscribe( () => {
      this.loadNewAd();
    });

    this.globalHub.categoriesLayers.subscribe( cats => {
      this.carLayer = cats;
      this.parseCatLayer();
    })   

    let carLayerArr =  this.globalHub.currentCatLayers.getValue();
    if(carLayerArr instanceof Array){
      this.carLayer = carLayerArr;
    }
  
    this.parseCatLayer();

    this.loadNewAd();  
  }

  private parseCatLayer(){
    if(this.carLayer.length == 0){
      return;
    }

    for(let itemL3 of this.carLayer){
      if(itemL3.layer2Id == this.catidL3){
        this.choiceCatValue = itemL3.layer2;
      }
      for(let itemL2 of itemL3.data){
        let index = 0;
        for(let cat of itemL2.cat){
          let catItem = {
            name : cat,
            id : itemL2.idCat[index]
          }
           this.catsList.push(catItem);
           index++;
        }
      }
    }
  }


  clearMinPrice(){
    this.priceMin = 0;
  }



  loadNewAd(){
    this.isLoadItem = true;

    let priceMax = -1;

    if(this.issortByPrice == true){
      priceMax = this.priceMax;
    }


    this.adsCollect = new Array();
    this.http.list_adsGetByPagin( this.activePage, this.stepPagin, this.catidL3, this.catIdL2, this.catId, this.QualityId,this.isDelivery,
      this.priceMin, priceMax,this.searchWord,this.idCurrency,this.arrOrderByValue, this.arrfiltersValueContainer )
    .subscribe(
      res => {
        this.searchWord = "";
        let response : any = res;
        if(response.isError == true){
          return;
        }

        this.priceMin = response.priceMin;
        this.priceMax = response.priceMax;

        if(this.isNewMinMaxPrice){
          this.isNewMinMaxPrice = false;
          this.sortByPrice(false);
        }
        if(response.data instanceof Array){      

          this.isNoAds = response.data.length > 0 ? false : true;
          let countPage = Number(response.countPages);

          this.countPage = new Array();
          for(let i = 1 ; i <= countPage; i++){
            this.countPage.push(i);
          }
          this.UpdatePagination();

          for(let ad of response.data){
            ad.isFavorit = false;
            ad.currency = this.metaController.GetCurrenciesByid(ad.currencyId);
            ad.qualityAd = this.metaController.GetQualityAdsByid(ad.qualityAdId);
            ad.typeOwner = this.metaController.GetTypeOwnersByid(ad.typeOwnerId);
            this.adsCollect.push(ad);
          }
          this.LoadFavorite();

          this.imgCollect = new Array(response.data.length);        
          for(let i = 0; i < this.imgCollect.length; i++){
            this.imgCollect[i] = "";
          }    

          this.isLoadItem = false;
          this.LoadMainImgs();      
        }
        else{
          let aMessage = new AlertMessage();
          this.globalHub.addAlertMessage( aMessage );
        }
      },
      err => {
       let aMessage = new AlertMessage();
       this.globalHub.addAlertMessage( aMessage );
      }
    )
  }

  choiceQualityAd(event : any){
    this.QualityId = event.currentTarget.id;
    this.loadNewAd();
  }

  changePrice(){
    this.activePage = 1;
    this.loadNewAd();
  }

  public LoadMainImgs(){

    for(let i = 0; i < this.adsCollect.length; i++){    
      this.http.getMainPicture(this.adsCollect[i].id, this.imgCollect[i] ).subscribe(
        res => {      
          
        const urlToBlob = window.URL.createObjectURL(res)  
        this.imgCollect[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);               
      },
        err => {
          this.imgCollect[i] = this.emptyImgUrl;
        }
    );
  }
  }

  countItemFilterStandart = 5;

  changeCountItemFilter(indexFilter : number, event : any){

    if(this.countItemFilter[indexFilter] == this.countItemFilterStandart){
      this.countItemFilter[indexFilter] = 
      this.filters[indexFilter].counts.length;

      event.target.innerText = 
      "Приховати частину";
    }
    else{
      this.countItemFilter[indexFilter] = 
      this.countItemFilterStandart;

      event.target.innerText = 
      "Показати все";

    }
  }

  addFavoriteAd(event : any, idAd : number){
    event.stopPropagation();
   
   }

   
  LoadFavorite(){
    let idUser = Number.parseInt(this.cookie.get("idUser"));

    if( !isNaN(idUser) ){
      this.http.getFavoriteAd(idUser)
      .subscribe(res => {
        let respArr : any = res;
        for(let itemFavAd of respArr.arrFavorite){
          let adFav = this.adsCollect.find( ad => ad.id == itemFavAd.adId );
          if(adFav != undefined){
            adFav.isFavorit = true;
          }
        }
      })
    }
  }


  changeFavoriteState(event : any,idAd : number){
    event.stopPropagation();
    let idUser = Number.parseInt( this.cookie.get("idUser"));
    if( isNaN(idUser) ){
     
      let aMessage =  new AlertMessage();
      aMessage.Title = "Попередження"
      aMessage.Message ="Щоб додати оголошення в вибране будь ласка авторизуйтеся";
      aMessage.TimeShow = 4000;

      this.globalHub.addAlertMessage(aMessage);

      return;
    }

      event.stopPropagation();
     
      let aMessage = new AlertMessage();
      aMessage.Title = "Успішно";
  
      let item = this.adsCollect.find( ad => ad.id == idAd );
  

          let addToFavorite = !item.isFavorit;
          item.isFavorit = !item.isFavorit;
      
          this.http.updateFavorite(idUser, item.id,addToFavorite)
          .subscribe( res  => {
            let response : any = res;
            if(response.isError == false){
  
              if(item != null && item != undefined){
                item.isFavorit = addToFavorite;
              }
  
              let valueCount = 0;
  
              if(item.isFavorit){   
                valueCount++;
              }
              else{     
                valueCount--;
              }
  
              this.globalHub.changeCountFavoriteAd(valueCount);
            }
            else{
              this.globalHub.addAlertMessage(aMessage);
            }
          },
          err => {
            this.globalHub.addAlertMessage(aMessage);
          }); 
  }



  loadFilters(idCat: number){

    this.http.getFilters(idCat)
    .subscribe(
      res =>{
          if(res instanceof Array){
          this.filters = res;  
          this.arrfiltersValueContainer = new Array();
          let index = 0;
          for(let itemFilter of this.filters){      
            let filterCont = new FilterValueContainer();
            this.arrfiltersValueContainer.push(filterCont);
            this.filters[index].useSlider = false;
            if(itemFilter.typeName == "combo"){

              let minValue = itemFilter.value[0];
              let maxValue = itemFilter.value[0];  

              for(let value of itemFilter.value){
                  if(minValue > value){
                    this.filters[index].minValue = value;           
                    minValue = value;                   
                  }
                  if(maxValue < value){
                    this.filters[index].maxValue = value;           
                    maxValue = value;
                  }               
              }    
            }      
            index++;     
          }
          this.countItemFilter = new Array(res.length);  
          for(let i = 0; i < res.length; i++){
            this.countItemFilter[i] = 5;
          }       
        }
      }
    )
  }

  ngOnInit(): void {
  
  }

  choiceFilterValue(event : any, idFilter: number){
   
   if(event.target.id == "useFilter"){
     let arr = event.currentTarget.getElementsByClassName("custom-checkbox");
    
     this.arrfiltersValueContainer[idFilter].values = new Array();
     this.arrfiltersValueContainer[idFilter].userSlider = this.filters[idFilter].useSlider;
     this.arrfiltersValueContainer[idFilter].idFilter =  this.filters[idFilter].idFilter;

     if(this.filters[idFilter].useSlider == false){   
        for(let item of arr){
          if(item.checked){
            this.arrfiltersValueContainer[idFilter]
            .values.push(item.id.replace("filterValue",""))
          }
        }
      }
      else{
        let arrInptValue = event.currentTarget.getElementsByClassName("inptPrice");
      
        if(arrInptValue != null && arrInptValue.length > 0){
         this.arrfiltersValueContainer[idFilter].minValue = arrInptValue[0].value;
         this.arrfiltersValueContainer[idFilter].maxValue = arrInptValue[1].value;
        }
      }
    this.loadNewAd();  
   }
  }


    upDateFilterCheckBox(){}

  userSliderFilter(state : boolean, indexFilter : number, event : any)
  {
    if(state == true){
      let arr = event.currentTarget.parentNode.getElementsByClassName("custom-checkbox");
      for(let i = 0; i < arr.length; i++){
        arr[i].checked = false;
      }
    }

    let contArr =  event.target.parentNode.parentNode.parentNode.parentNode

    let arr = contArr.getElementsByClassName("custom-checkbox");
  
    this.arrfiltersValueContainer[indexFilter].values = new Array();
    this.arrfiltersValueContainer[indexFilter].userSlider = this.filters[indexFilter].useSlider;
    this.arrfiltersValueContainer[indexFilter].idFilter =  this.filters[indexFilter].idFilter;

    if(this.filters[indexFilter].useSlider == false){   
       for(let item of arr){
         if(item.checked){
           this.arrfiltersValueContainer[indexFilter].values.push(item.id.replace("filterValue",""))
         }
       }
     }

    this.filters[indexFilter].useSlider = state;
  }

  choiceCat(event : any){

    let innerValue = event.target.innerText
    if(this.isDropListCat){
     innerValue = innerValue.replace("<b>",'').replace("</b>","");
    }

    this.choiceCatValue = innerValue;
    this.catId = event.target.id

    this.filters = new Array();
    this.arrfiltersValueContainer = new Array();

    this.isDropListCat = false;
    this.isScrollListCat = true;
    this.isNewMinMaxPrice = true;
    this.loadFilters(event.currentTarget.id);
    this.loadNewAd();
  }

  choiceCatL2(idCat : number, value : string){
    this.catId = 0;
    this.catIdL2 = idCat;
    this.choiceCatValue = value;
    this.loadNewAd();

    this.isDropListCat = false;

    this.isScrollListCat = true;

    this.filters = new Array();
    this.isNewMinMaxPrice = true;
    this.arrfiltersValueContainer = new Array();
  }

  choiceCatL3(idCat : number, value : string){
    this.catId = 0;
    this.catIdL2 = 0;
    this.catidL3 = idCat;
    this.choiceCatValue = value;
    this.loadNewAd();

    this.isDropListCat = false;

    this.isScrollListCat = true;

    this.filters = new Array();
    this.isNewMinMaxPrice = true;
    this.arrfiltersValueContainer = new Array();
  }

  resetFilters(){
    this.isDelivery = false;
    this.QualityId = 0;

    let isDelInpt : any = document.getElementById("isDelivery");
    isDelInpt.checked = false;

    let qualityId : any = document.getElementById("stateAll");
    qualityId.checked = true;

    this.idCurrency = 0;

    let blockCurrency : any = document.getElementById("blockCurrency");
    let arrCurrency = blockCurrency.getElementsByTagName("span");
    for(let item of arrCurrency){
      if(item == arrCurrency[0]){
        continue;
      }
      if(item.id != 0){
        item.classList.remove("isPickedItemCurrency");
      }
      else{
        item.classList.add("isPickedItemCurrency");
      }
    }

    this.issortByPrice = false;

    let orderTypes : any  = document.getElementById("choiceFilterBlock")?.getElementsByTagName("span");


    for(let item of orderTypes){
      if(item == orderTypes[0]){
        continue;
      }
      if(item.classList.contains("isPickedItem")){
        item.classList.remove("isPickedItem");
      }
    }

    orderTypes[1].classList.add("isPickedItem");
    this.choiceOrderType = orderTypes[1];


    this.arrOrderByValue[0] = -1;

    for(let i = 1; i < 3; i++){
    let arrow = orderTypes[i].getElementsByTagName('svg')[0];

      if(arrow.classList.contains("arrowDown")){
        arrow.classList.add("arrowUp")
      }
    }
    
    this.choiceAllCat();
  }

  choiceAllCat(){
    this.filters = new Array();
    this.catidL3 = 0;
    this.catIdL2 = 0;
    this.catId = 0;
    this.choiceCatValue = "Всі категорії";
    this.filters = new Array();
    this.isNewMinMaxPrice = true;
    this.arrfiltersValueContainer = new Array();
    this.loadNewAd();
  }

  changeDel = true;
  changeIsDelivery(){
    if(this.changeDel){
      this.changeDel = !this.changeDel;
      this.isDelivery = !this.isDelivery;
      this.loadNewAd();
    }
    else{
      this.changeDel = !this.changeDel;
    }
  
  }

  hoverInptCat(){
    this.isDropListCat = true;
  }

  ChangeInptCat($event : any){
    this.isDropListCat = false;
    this.isScrollListCat = false;

    let arrCatItem = document.getElementsByClassName("CatItem");

    let searchWord = $event.target.value;

    let index = 0;
    for(let cat of this.catsList){
      let startIndex = cat.name.toLowerCase().indexOf(searchWord.toLowerCase());
      
      if(startIndex >= 0){      
        arrCatItem[index].removeAttribute("hidden");
        arrCatItem[index].innerHTML = 
          this.MarkWord(cat.name, searchWord, startIndex, startIndex + searchWord.length);       
      }
      else
      {
        arrCatItem[index].setAttribute("hidden", "true");
      }
      index++;
    }
  }

  MarkWord(str : any, markedPart : any, start : number, end : number) {
    
    let leftPart = str.substring(0, start);
    let rightPart = str.substring(end, str.length);
    return leftPart + `<b>${markedPart}</b>` + rightPart;
  }

  CloseScrollDropCatBlock(){
    this.isScrollListCat = true;
  }

  openCloseTaggle(event : any){
    let triangle = event.currentTarget.parentNode .getElementsByClassName("rightPart")[0];
    
    let panel = event.currentTarget.parentNode .getElementsByClassName("panel")[0];

    if(panel.style.display == "block"){
      panel.style.display = "none"
      triangle.classList.remove("isOpenFilterMenu");
    }
    else{
      triangle.classList.add("isOpenFilterMenu");
      panel.style.display = "block";
    }
  }

  choiceOrderType : any;

  pickedCurrency(event:any){
    if(event.target.tagName != "SPAN"){
      return;
    }
    
    let arr = event.currentTarget.getElementsByTagName("span")
    for(let itemCurrecy of arr){
      if(itemCurrecy.classList.contains("isPickedItemCurrency")){
        itemCurrecy.classList.remove("isPickedItemCurrency");
      }
    }
    event.target.classList.add("isPickedItemCurrency");

    this.idCurrency = event.target.id;
    this.isNewMinMaxPrice = true;
    this.sortByPrice(false);
    this.loadNewAd();
  }
  issortByPrice = false;
  sortByPrice(value : boolean){
    this.issortByPrice = value;
  }

  watchAd(id : any){
    this.route.navigate([`/${this.route.url}/card-ad/${id}`]);
  }

  pickedSort(event:any){
    
    if(event.target.tagName != "SPAN"){
      return;
    }

      let arr = event.currentTarget.getElementsByTagName("span")
      this.activePage = 1;

      if(this.choiceOrderType == undefined){
        for(let typeOrder of arr){
          if(typeOrder.classList.contains("isPickedItem")){
            this.choiceOrderType = typeOrder;
          }
        }
      }

      let isFirstClick = true;
      let arrow = this.choiceOrderType.getElementsByTagName('svg')[0];

      if(event.target.classList.contains("isPickedItem")){
        isFirstClick = false;
        this.choiceOrderType = event.target;

        if(event.target.id != "random"){
          if(arrow.classList.contains("arrowUp")){
            arrow.classList.remove("arrowUp")
            arrow.classList.add("arrowDown")
          }
          else{
            arrow.classList.remove("arrowDown")
            arrow.classList.add("arrowUp")       
          }
        }
      }
      else{
        this.choiceOrderType.classList.remove("isPickedItem");
        this.choiceOrderType = event.target;
        this.choiceOrderType.classList.add("isPickedItem");
        arrow = this.choiceOrderType.getElementsByTagName('svg')[0];
      }
    
    let indexOrderBy = 0;
    for(let i = 1; i < arr.length; i++){
      if(event.target == arr[i]){
        indexOrderBy = i - 1;
      }
      this.arrOrderByValue[i - 1] = 0;
    } 

      if(arrow.classList.contains("arrowUp")){
        this.arrOrderByValue[indexOrderBy] = -1;     
      }
      else{
        this.arrOrderByValue[indexOrderBy] = 1;
      }
    this.loadNewAd();
  }

  changeTypeShowAds(event : any){
    let arr = document.getElementsByClassName("containerImgs");

    for(let i = 0; i < arr.length; i++){
      arr[i].id = arr[i].id == "choiceTypeAdsShow" ? "" : "choiceTypeAdsShow"
    }

    this.isPlitcaShow = !this.isPlitcaShow;
    this.stepPagin = this.isPlitcaShow ? 28 : 10;

    this.activePage = 1;
    this.loadNewAd();
  }

  private indexStartPag = 0;
  public activePage : number = 1 ;
  public countPage = Array();

  public linePagin = Array();
  public countLinePagin = 10;

  public isLeftDis = true;
  public isRightDis = true;

  setActivaPagin(event : any){
    let idPag = event.target.id;
    if(idPag == ""){
      return;
    }
    if(idPag == 0 ){
      this.activePage--;
    }
    else if(idPag == Number(this.countPage.length) +  Number(2) ){
      this.activePage++;
    }
    else{
      this.activePage = idPag;
    }
     
      let indexActivePage = this.linePagin.findIndex( i => i == this.activePage);
      let rightBorderPag = this.linePagin.length - 1;
      let leftBorderPag = 0;
      let stepPag = this.linePagin.length - 1;


      if(indexActivePage == rightBorderPag){ 
      let needStock = this.countPage.length - this.linePagin[rightBorderPag];
     
      if( needStock > stepPag ){
        this.indexStartPag += stepPag;
      }
      else{
        this.indexStartPag += needStock;
      }
    }
    else if(indexActivePage == leftBorderPag){
      let needStock = this.linePagin[leftBorderPag] - stepPag;

      if( needStock <= 0 ){
        this.indexStartPag = 0;
      }
      else{
        this.indexStartPag -= stepPag;
      }
    }
    this.loadNewAd();
  }


  UpdatePagination(){
    let count = this.countPage.length;

    if(count < 10){
      this.countLinePagin = count
      this.linePagin = new Array(count)
    }
    else{
      this.countLinePagin = 10
      this.linePagin = new Array(10)
    }
    

      let index = 0;
      let reserveCount = Number(this.indexStartPag) + Number(this.linePagin.length);

      for(let i = this.indexStartPag ; i < reserveCount ; i++ ){
        this.linePagin[index++] = this.countPage[i] ;
      }

      this.isLeftDis = this.activePage > 1 ? false : true;
      this.isRightDis = this.activePage < this.countPage.length ? false : true;

}

}


