import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';
import { MsgChat } from 'src/app/Classes/msg-chat';
import { timer } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  newMsg = {
    idChat : 0,
    idUser : 0,
    value  : ""
  }

  msgArr = Array<MsgChat>();

  constructor(private cookie : CookieService,
              private activeRoute : ActivatedRoute,
              private http : HttpService,
              private globalHub : GlobalHubService) 
  { 
    this.newMsg.idUser = Number.parseInt(this.cookie.get("idUser"));
    this.newMsg.idChat = this.activeRoute.snapshot.params['idChat'];

    this.loadMsg();
  }

  ngOnInit(): void {
  }

  sendMsg(){
    if(this.newMsg.value.length == 0){
      return;
    }
   this.http.createMsg(this.newMsg)
   .subscribe( res => {
     let response : any = res;
     
    if(response.isError){
      let aMessage = new AlertMessage();
      this.globalHub.addAlertMessage(aMessage);
      return;
    }
    this.addNewMsg(response.msg);

   }, err => {
    let aMessage = new AlertMessage();
    this.globalHub.addAlertMessage(aMessage);
   })
  }

  loadMsg(){
    this.http.getMsgChat(this.newMsg.idChat)
    .subscribe( res => {
      let response : any = res;

      if(response.isError){
        let aMessage = new AlertMessage();
        this.globalHub.addAlertMessage(aMessage);
        return;
      }

      if(response.data instanceof Array){
          for(let msg of response.data){
            this.addNewMsg(msg);
        }
      }

      this.newMsg.value = "";

    },err => {
      let aMessage = new AlertMessage();
      this.globalHub.addAlertMessage(aMessage);
    })
  }

  addNewMsg(msg : any){

    let newMsg = new MsgChat();
    newMsg.id = msg.id;
    newMsg.value = msg.value;

    if(this.newMsg.idUser != msg.userId){ 
      newMsg.isMy = false;
    }
    this.msgArr.push(newMsg);
    this.scrollDown();
  }

  scrollDown(){
    timer(100)
      .pipe()
      .subscribe( () => {
        let block : any = document.getElementById("msgBlock");
        block.scrollTop = block.scrollHeight;
      });
  }

}
