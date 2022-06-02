import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-chats',
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css']
})
export class MyChatsComponent implements OnInit {

  chats = new Array();

  idUser = 0;

  constructor(
    private http : HttpService,
    private cookie : CookieService,
    private globalHub : GlobalHubService,
    private route : Router
  ) { 
    this.idUser = Number.parseInt( this.cookie.get("idUser") );
    this.loadChats();
  }

  ngOnInit(): void {
  }


  loadChats(){
    this.http.getMyChats(this.idUser)
    .subscribe( res => {
      let response : any = res;
      if(response.isError){
        let aMessage = new AlertMessage();
        this.globalHub.addAlertMessage(aMessage);
      }
       this.chats = response.data;
       console.log(this.chats)

    }, err => {
      let aMessage = new AlertMessage();
        this.globalHub.addAlertMessage(aMessage);
    } )
  }

  showChat(idChat : number){
    this.route.navigate([`chat/${idChat}`]);
  }

}
