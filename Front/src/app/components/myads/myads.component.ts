import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-myads',
  templateUrl: './myads.component.html',
  styleUrls: ['./myads.component.css']
})


export class MyadsComponent implements OnInit {

  private countAds : number = 2;

  public col : number = 2;
 
  public adsCol = Array();

  public items = [
    "1",
    "2",
    "3",
    "4"
  ]

  constructor() {
    for(let i = 0; i < 4; i++ ){
      this.adsCol.push(this.items);
    }
    console.log(this.adsCol);
  }

  ngOnInit(): void {
  }

}
