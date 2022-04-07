import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpService } from 'src/app/http.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-emailconfirm',
  templateUrl: './emailconfirm.component.html',
  styleUrls: ['./emailconfirm.component.css']
})
export class EmailconfirmComponent implements OnInit {

  private querySubscription: Subscription | any;
  constructor(private route: ActivatedRoute,
              private httpSevice: HttpService) { }

  ngOnInit(): void {
   
    let id : string = "";
    let token : string = "";

    this.querySubscription = this.route.queryParams.subscribe(
      (queryParam: any) => {    
        id = queryParam['id'];
         token =  queryParam['token'].replaceAll(' ',"+");  
      })
      
    const body = { id : id, token : token }

    this.httpSevice.confirmEmail(  body  )
       .subscribe( authUserResponse  => { 
          console.log( authUserResponse );
        });
  }
}


