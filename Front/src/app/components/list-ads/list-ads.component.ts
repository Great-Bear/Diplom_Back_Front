import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilterValueContainer } from 'src/app/Classes/Request/filter-value-container';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrls: ['./list-ads.component.css']
})
export class ListAdsComponent implements OnInit {

  carLayer : any;
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
              private route : Router
               ) 
  { 
   this.catId = activateRoute.snapshot.params['idCategory'];
   let queryStr = activateRoute.snapshot.params['searchQuery'];


   if(queryStr != undefined){
     this.searchWord = queryStr;
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

    this.carLayer = this.globalHub.currentCatLayers.getValue();
    this.pardeCatLayer();

    this.loadNewAd();
    
  }

  private pardeCatLayer(){
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

    this.http.list_adsGetByPagin( 1, this.stepPagin, this.catId, this.QualityId,this.isDelivery,
      this.priceMin, priceMax,this.searchWord,this.idCurrency,this.arrOrderByValue, this.arrfiltersValueContainer )
    .subscribe(
      res => {
        let response : any = res;
        console.log(res);
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


          for(let ad of response.data){
            this.adsCollect.push(ad);
          }
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


    this.isDropListCat = false;

    this.isScrollListCat = true;
    this.loadFiltes(event.currentTarget.id);
    this.loadNewAd();
  }

  choiceAllCat(){
    this.filters = new Array();
    this.catId = 0;
    this.choiceCatValue = "Все категории";
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
    this.loadNewAd();
  }

}
