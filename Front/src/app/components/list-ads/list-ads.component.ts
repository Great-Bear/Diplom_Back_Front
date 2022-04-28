import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-ads',
  templateUrl: './list-ads.component.html',
  styleUrls: ['./list-ads.component.css']
})
export class ListAdsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {


    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    if(output != null && slider != null){
    
    output.innerHTML =  slider.getAttribute("value") + "";
    
    slider.oninput = function() {
      let a : any = this;
      console.log(a.value)
      /*
      console.log(event.target);
      console.log(event.target.getAttribute("value"));
      if(output != null)
      output.innerHTML = event.target.getAttribute("value");
      */
    }
  }

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
