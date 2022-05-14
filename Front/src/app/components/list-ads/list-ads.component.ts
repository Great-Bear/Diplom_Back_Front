import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { GlobalHubService } from 'src/app/global-hub.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrls: ['./list-ads.component.css']
})
export class ListAdsComponent implements OnInit {

  carLayer : any;
  catsList = new Array();
  catsListMarker = new Array();

  filters = new Array();

  adsCollect = new Array();
  imgCollect = new Array();

  isPlitcaShow = false;

  choiceCatValue : string = "Все категории";
  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  isDropListCat = true;
  isScrollListCat = true;
  stepPagin : number = 10;
  countItemFilter = Array();

  constructor(private http : HttpService,
              private globalHub : GlobalHubService,
              private sanitizer: DomSanitizer,
               ) 
  { 
   this.carLayer = new Array();
   
    this.globalHub.categoriesLayers.subscribe( cats => {
      this.carLayer = cats;
     
      for(let itemL3 of this.carLayer){
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
    })   

    this.loadNewAd();
    
  }

  loadNewAd(){
    this.http.list_adsGetByPagin( 1, this.stepPagin, 0 )
    .subscribe(
      res => {
        let response : any = res;
        if(response.isError == true){
          alert("error");
          return;
        }
        if(response.data instanceof Array){
          this.adsCollect = new Array();
         
          for(let ad of response.data){
            this.adsCollect.push(ad);
          }
          this.imgCollect = new Array(response.data.length);
          for(let i = 0; i < this.imgCollect.length; i++){
            this.imgCollect[i] = this.emptyImgUrl;
          }
          console.log(this.adsCollect);
        }
        this.LoadMainImgs();
      },
      err => {
        alert("error load ads");
      }
    )
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

  choiceCat(event : any){

    let rep = event.target.innerText.replace("<b>",'');
    rep = rep.replace("</b>","");
    console.log(rep);

    this.choiceCatValue = rep;

    this.isDropListCat = false;

    this.isScrollListCat = true;

    this.loadFiltes(event.currentTarget.id);
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

  pickedSort(event:any){
    
    if(event.target.tagName != "SPAN"){
      return;
    }

    let arr = event.currentTarget.getElementsByTagName("span")
    console.log(arr[0] , event.target)
    if(arr[0] == event.target){
      return;
    }

    for(let i = 0; i < arr.length; i++){
      if(arr[i].classList.contains("isPickedItem")){
        arr[i].classList.remove("isPickedItem");
      }
    }
    event.target.classList.add("isPickedItem");
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
