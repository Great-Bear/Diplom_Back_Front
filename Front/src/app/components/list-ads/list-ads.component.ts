import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { GlobalHubService } from 'src/app/global-hub.service';

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

  adsCollect = new Array(10);

  isPlitcaShow = true;

  choiceCatValue : string = "Все категории";

  isDropListCat = true;
  isScrollListCat = true;


  constructor(private http : HttpService,
              private globalHub : GlobalHubService
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

    
  }

  loadFiltes(idCat: number){
    this.http.getFilters(idCat)
    .subscribe(
      res =>{
          if(res instanceof Array){
          this.filters = res;           
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

  changeTypeShow(event : any){
    console.log(event.target);

    let arr = document.getElementsByClassName("containerImgs");

    for(let i = 0; i < arr.length; i++){
      arr[i].id = arr[i].id == "choiceTypeAdsShow"
      ?""
      :"choiceTypeAdsShow"
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
    this.isPlitcaShow = !this.isPlitcaShow;
  }

}
