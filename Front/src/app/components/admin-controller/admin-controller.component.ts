import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-controller',
  templateUrl: './admin-controller.component.html',
  styleUrls: ['./admin-controller.component.css']
})
export class AdminControllerComponent implements OnInit {

  pagesArr = new Array();

  currectPart = 0;

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
  }

  choicePart(idPart : number){
    this.currectPart = idPart;
  }

}
