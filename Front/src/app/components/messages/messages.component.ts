import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  content = "";
  idContent = true;

  containerContent = [
    "(╮°-°)╮┳━━┳",
    "(╯°-°)╯ ┻━━┻"
  ]

  arrContainerCotent = [
    this.containerContent
  ]

  @Input() typeContent : number = 0;

  timerObject : any;

  constructor() 
  {
    this.content = this.containerContent[0];
    this.changemsg();
  }

  changemsg(){
   this.timerObject = timer(400)
    .pipe()
    .subscribe( () => {
      this.idContent = !this.idContent;      
      this.content = this.containerContent[ Number (this.idContent) ];
      this.changemsg();
    });
  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void
  {
    this.timerObject.unsubscribe();
  }

}
