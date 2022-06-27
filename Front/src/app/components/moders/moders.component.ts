import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';

@Component({
  selector: 'app-moders',
  templateUrl: './moders.component.html',
  styleUrls: ['./moders.component.css']
})
export class ModersComponent implements OnInit {

  modersCollect = new Array();

  requBody = {
    id : 0
  }

  constructor(
  private http : HttpService,
  private globalHub : GlobalHubService
  ){ 
    this.loadModers();
    this.globalHub.listModers.subscribe( () => {
      this.loadModers();
    });
  }

  ngOnInit(): void {
  }

  loadModers(){
    this.http.loadModers()
    .subscribe( 
      res => {
       let response : any = res;
        if(response.isError){        
          let aMessage = new AlertMessage();
          aMessage.Message = response.message;
          this.globalHub.addAlertMessage(aMessage);
        }
        else{
          console.log(response.data)
          this.modersCollect = response.data;
        }
    }, err => {
      this.globalHub.addAlertMessage(new AlertMessage());
    } )
  }

  deleteModer(id : number){

  let isConfirmDelite = confirm(`Ви дійсно хочете видалити модератора? 
    ${this.modersCollect.find( m => m.id == id ).email}`);

    if(isConfirmDelite == false){
      return
    }

    this.requBody.id = id;
    this.http.deleteModer(this.requBody)
    .subscribe( res => {
      let responese : any = res;
      let aMessage = new AlertMessage();
      if(responese.isError){     
        aMessage.Message = responese.message;
        this.globalHub.addAlertMessage(aMessage);
      }
      else{
        aMessage.Title = "Успішно";
        aMessage.Message = "Модератор вилучено";
        this.loadModers();
      }
      this.globalHub.addAlertMessage(aMessage);
    }, err => {
      this.globalHub.addAlertMessage(new AlertMessage());
    });
  }

}
