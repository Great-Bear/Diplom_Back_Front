import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-card-ad',
  templateUrl: './card-ad.component.html',
  styleUrls: ['./card-ad.component.css']
})
export class CardAdComponent implements OnInit {

  data : any;

  constructor(
    private activateRoute: ActivatedRoute,
    private http : HttpService) { 
  }

  ngOnInit(): void {
    try {
      this.http.getOneAd(this.activateRoute.snapshot.params['id']).subscribe(
        res =>{
          this.data = res;
          if(this.data.isError){
            console.log(this.data.error)
          }
        }
      )
    } catch (error) {
      console.log("Ошибка загрузки товара")
    }
  }

}
