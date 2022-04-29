import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrls: ['./list-ads.component.css']
})
export class ListAdsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('draggable').draggable(); // WORKS!
    
  }

  test(event : any){


    let a = this;
    console.log(event.target)
    let slider = document.getElementById("myRange");   
  console.log(event.target.getAttribute("value"));
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
