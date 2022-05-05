import { Component, IterableDiffers, OnInit } from '@angular/core';
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

  choiceCatValue = "Смартфоны";

  isDropListCat = false;


  constructor(private http : HttpService,
              private globalHub : GlobalHubService
               ) 
  { 
    this.carLayer = this.globalHub.categoriesLayers;

    this.globalHub.categoriesLayers.subscribe( cats => {
      this.carLayer = cats;
     
      for(let itemL3 of this.carLayer){
        for(let itemL2 of itemL3.data){
          for(let cat of itemL2.cat){
             this.catsList.push(cat);
          }
        }
      }
    })   

  }

  ngOnInit(): void {

  }

  choiceCat(event : any){
    this.choiceCatValue = event.target.innerText;
  }

  testChange(){
    console.log("I am change")
    this.isDropListCat = false;
  }
  OutTest(){
    this.isDropListCat = true;
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

}
