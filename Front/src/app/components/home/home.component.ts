import { Component, OnInit } from '@angular/core';
import { TypeAd } from 'src/app/Classes/typeAd';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public typeAd = new TypeAd();

  public countPage = Array();

  public linePagin = Array(10);

  public activePage : number = 1 ;

  public isLeftDis = true;
  public isRightDis = false;

  constructor(
    private httpService : HttpService
  ) {
   
    this.httpService.CountPaginPage().subscribe(
      res => {
        let count = Number(res.toString());

        for(let i = 1 ; i <= count; i++){
          this.countPage.push(i);
        }
    
        let index = 0;
        for(let i = this.activePage - 1 ; i < this.linePagin.length; i++ ){
          this.linePagin[index++] = this.countPage[i] ;
        }
        
      } 
    )


    

    this.httpService.getCategories().subscribe( 
      res => {
        if(res instanceof Array){
         this.typeAd.Categories = res;
        }
      }
     )

     this.httpService.getBrands().subscribe( 
       res => {
         if(res instanceof Array){
          this.typeAd.Brends = res;
         }
       }
      )
   }

   private indexStartPag = 0;
   setActivaPagin(event : any){
    let idPag = event.target.id;
    if(idPag == ""){
      return;
    }

    if(idPag == 0 ){
      this.activePage--;
    }
    else if(idPag == Number(this.countPage.length) +  Number(2) ){
      this.activePage++;
    }
    else{
      this.activePage = idPag;
    }


     
      let indexActivePage = this.linePagin.findIndex( i => i == this.activePage);
      let rightBorderPag = this.linePagin.length - 1;
      let leftBorderPag = 0;
      let stepPag = this.linePagin.length - 1;




      if(indexActivePage == rightBorderPag){ 
      let needStock = this.countPage.length - this.linePagin[rightBorderPag];
     
      if( needStock > stepPag ){
        this.indexStartPag += stepPag;
      }
      else{
        this.indexStartPag += needStock;
      }
    }
    else if(indexActivePage == leftBorderPag){
      let needStock = this.linePagin[leftBorderPag] - stepPag;

      if( needStock <= 0 ){
        this.indexStartPag = 0;
      }
      else{
        this.indexStartPag -= stepPag;
      }
    }

    this.UpdatePagination();
  }
   
  UpdatePagination(){
    this.isLeftDis = this.activePage > 1 ? false : true;
    this.isRightDis = this.activePage < this.linePagin.length + 1 ? false : true;

   for(let i = 0; i < this.linePagin.length ; i++ ){
    this.linePagin[i] = this.countPage[this.indexStartPag + i];
  }

  }
  ngOnInit(): void {
  }

}
