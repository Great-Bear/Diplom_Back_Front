import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterValueContainer } from 'src/app/Classes/Request/filter-value-container';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessage } from 'src/app/Classes/alert-message';


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
  QualityId = 0;
  isDelivery = true;

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

  isPlitcaShow = false;
  isNoAds = false;

  choiceCatValue : string = "Все категории";
  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  isDropListCat = true;
  isScrollListCat = true;
  stepPagin : number = 10;
  countItemFilter = Array();

  idCurrency = 0;

  arrfiltersValueContainer = new Array();

  constructor(private http : HttpService,
              private globalHub : GlobalHubService,
              private sanitizer: DomSanitizer,
              private activateRoute: ActivatedRoute,
              private route : Router,
              private cookie : CookieService
               ) 
  { 

    this.countPage = new Array();
    for(let i = 1 ; i <= 15; i++){
      this.countPage.push(i);
    }
    this.UpdatePagination();

   this.catId = activateRoute.snapshot.params['idCategory'];
   let queryStr = activateRoute.snapshot.params['searchQuery'];

   if(queryStr != undefined){
     this.searchWord = queryStr;
   }
   if(this.catId == undefined){
     this.catId = 0;
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
      this.pardeCatLayer();
    })   

    let carLayerArr =  this.globalHub.currentCatLayers.getValue();
    if(carLayerArr instanceof Array){
      this.carLayer = carLayerArr
    }
  
    this.pardeCatLayer();

    this.loadNewAd();
    this.loadFiltes(this.catId);
    
  }

  private pardeCatLayer(){
    if(this.carLayer.length == 0){
      return;
    }
    for(let itemL3 of this.carLayer){
      for(let itemL2 of itemL3.data){
        let index = 0;
        for(let cat of itemL2.cat){
          let catItem = {
            name : cat,
            id : itemL2.idCat[index]
          }
           this.catsList.push(catItem);
          if(catItem.id == this.catId){
            this.choiceCatValue = catItem.name;
          }
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

    let priceMax= -1;

    if(this.issortByPrice == true){
      priceMax = this.priceMax;
    }
    console.log(this.arrOrderByValue);
    this.http.list_adsGetByPagin( this.activePage, this.stepPagin, this.catId, this.QualityId,this.isDelivery,
      this.priceMin, priceMax,this.searchWord,this.idCurrency,this.arrOrderByValue, this.arrfiltersValueContainer )
    .subscribe(
      res => {
        let response : any = res;
        if(response.isError == true){
          alert(response.error);
          return;
        }
        if(this.isNewMinMaxPrice){
          this.priceMin = response.priceMin;
          this.priceMax = response.priceMax;
          this.isNewMinMaxPrice = false;
          this.sortByPrice(false);
        }
        if(response.data instanceof Array){
          this.adsCollect = new Array();
         
          if(response.data.length > 0){
            this.isNoAds = false
          }
          else{
            this.isNoAds = true;
          }

          let count = Number(response.countPages);

          this.countPage = new Array();
          for(let i = 1 ; i <= count; i++){
            this.countPage.push(i);
          }
          this.UpdatePagination();

          for(let ad of response.data){
            ad.isFavorit = false;
            this.adsCollect.push(ad);
          }

          this.LoadFavorite();

          this.imgCollect = new Array(response.data.length);
          for(let i = 0; i < this.imgCollect.length; i++){
            this.imgCollect[i] = this.emptyImgUrl;
          }       
        }
        this.isLoadItem = false;
        this.LoadMainImgs();
      },
      err => {
        alert("error load ads");
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
      "Скрыть часть";
    }
    else{
      this.countItemFilter[indexFilter] = 
      this.countItemFilterStandart;

      event.target.innerText = 
      "Показать все";

    }
  }

  addFavoriteAd(event : any, idAd : number){
    event.stopPropagation();
   
   }

   
  LoadFavorite(){
    let idUser = Number.parseInt(this.cookie.get("idUser"));

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


  changeFavoriteState(event : any,idAd : number){

      event.stopPropagation();
     
      let aMessage = new AlertMessage();
      aMessage.Title = "Успешпо";
  
      let item = this.adsCollect.find( ad => ad.id == idAd );
  
          let idUser = Number.parseInt( this.cookie.get("idUser"));
          let addToFavorite = !item.isFavorit;
  
      
          this.http.updateFavorite(idUser, item.id,addToFavorite)
          .subscribe( res  => {
            let response : any = res;
            if(response.isError == false){
  
              if(item != null && item != undefined){
                item.isFavorit = addToFavorite;
              }
  
              let valueCount = 0;
  
              if(item.isFavorit){   
                aMessage.Message = "Товар добавлен в избранные";
                valueCount++;
              }
              else{     
                aMessage.Message = "Товар удалён из избранных";
                valueCount--;
              }
  
              this.globalHub.changeCountFavoriteAd(valueCount);
  
              this.globalHub.addAlertMessage(aMessage);
            }
            else{
              aMessage.Title = "Ошибка :(";
              aMessage.Message = "Ой что-то пошло не так";
              this.globalHub.addAlertMessage(aMessage);
            }
          },
          err => {
            aMessage.Title = "Ошибка :(";
            aMessage.Message = "Сервер пока отдыхает";
            this.globalHub.addAlertMessage(aMessage);
          }); 
  }



  loadFiltes(idCat: number){

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
            this.arrfiltersValueContainer[idFilter].values.push(item.id.replace("filterValue",""))
          }
        }
      }
      else{
        let arrInptPrice = event.currentTarget.getElementsByClassName("inptPrice");
      
        if(arrInptPrice != null && arrInptPrice.length > 0){
         this.arrfiltersValueContainer[idFilter].minValue = arrInptPrice[0].value;
         this.arrfiltersValueContainer[idFilter].maxValue = arrInptPrice[1].value;
        }
      }
    this.loadNewAd();
    
   }
  }

  userSliderFilter(state : boolean, indexFilter : number, event : any)
  {
    if(state == true){
      let arr = event.currentTarget.parentNode.getElementsByClassName("custom-checkbox");
      for(let i = 0; i < arr.length; i++){
        arr[i].checked = false;
      }
    }
    this.filters[indexFilter].useSlider = state;
  }

  choiceCat(event : any){

    let rep = event.target.innerText.replace("<b>",'');
    rep = rep.replace("</b>","");

    this.choiceCatValue = rep;
    this.catId = event.target.id

    this.filters = new Array();
    this.arrfiltersValueContainer = new Array();

    this.isDropListCat = false;

    this.isScrollListCat = true;
    this.loadFiltes(event.currentTarget.id);
    this.loadNewAd();
  }

  resetFilters(){
    this.isDelivery = true;
    this.QualityId = 0;

    let isDelInpt : any = document.getElementById("isDelivery");
    isDelInpt.checked = true;

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
    this.catId = 0;
    this.choiceCatValue = "Все категории";
    this.filters = new Array();
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
      if(arr[0] == event.target){
        return;
      }

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
    console.log(id);
    this.route.navigate([`/card-ad/${id}`]);
  }

  pickedSort(event:any){
    
    if(event.target.tagName != "SPAN"){
      return;
    }

      let arr = event.currentTarget.getElementsByTagName("span")
      if(arr[0] == event.target){
        return;
      }
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
      arr[i].id = arr[i].id == "choiceTypeAdsShow"
      ?""
      :"choiceTypeAdsShow"
    }

    this.isPlitcaShow = !this.isPlitcaShow;
    if(this.isPlitcaShow == true){
      this.stepPagin = 28;
    }
    else{
      this.stepPagin = 10;
    }
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
