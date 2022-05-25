import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { CookieService  } from 'ngx-cookie-service'; 
import { TypeAd } from 'src/app/Classes/typeAd';
import { RequCreateAd } from 'src/app/Classes/Request/requ-create-ad';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  Title : string = "title ad";
  Describe : string = "describe ad";

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  private countImgs : number = 12;

  public requData : RequCreateAd = new RequCreateAd();

  public typeAd : TypeAd = new TypeAd();

  urlImgs : string[] = new Array(this.countImgs);
  cancelBts : boolean[] = new Array(this.countImgs);

  categoryList = new Array();

  filterList = new Array();

  constructor(private httpService : HttpService,
              private cookieService : CookieService,
              private route : Router) {

                this.requData.idUser = this.cookieService.get("idUser");

               for(let i = 0; i < this.urlImgs.length; i++){
                 this.urlImgs[i] = this.emptyImgUrl;
                 this.cancelBts[i] = false;
               }

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

  ngOnInit(): void {
  }

  FileSelected(event : any){
   
    let target = event.target;
    let nowLoadedFile = target.files;

     //  if ( !this.Imgs.type.startsWith("image/") ) {
    //    alert("Image only please....");
        //}

      let idLoadedImg = 0;
     for(let i = 0; i < this.urlImgs.length; i++){

      if(this.urlImgs[i] == this.emptyImgUrl){
        let reader = new FileReader();

        reader.onloadend = () => {  
          let urlImg : any = reader.result;     
          this.cancelBts[i] = true;  
          this.urlImgs[i] = urlImg;     
          };
          reader.readAsDataURL(nowLoadedFile[idLoadedImg]);           
          this.requData.Files.push(nowLoadedFile[idLoadedImg]);
          idLoadedImg++;
      }
      if(nowLoadedFile.length == idLoadedImg){
        return;
      }
    }
  }

  changeCat(event : any){
    console.log(this.requData.Category);
    this.httpService.getFilters(Number.parseInt(this.requData.Category))
    .subscribe(res => {
      this.filterList = new Array();
      if(res instanceof Array){
        for(let filter of res){
          this.filterList.push(filter);
        }
      }   
      this.requData.FiltersValue = new Array(this.filterList.length);
    })
  }

  delImg(event: any){
    let indexUrl = event.target.getAttribute("id") as number;

    this.requData.Files.splice( indexUrl, 1 );

    for(; indexUrl < this.urlImgs.length;){     

      if( this.urlImgs[indexUrl] == this.emptyImgUrl ){
        this.cancelBts[indexUrl - 1] = false;
        break;
      }

      if(indexUrl == this.urlImgs.length - 1 ){
        this.urlImgs[indexUrl] = this.emptyImgUrl;
        this.cancelBts[indexUrl] = false;
        break;
      }   
        this.urlImgs[indexUrl] = this.urlImgs[++indexUrl]
      }  
  }

  CreateAds(){    

    this.requData.idUser = this.cookieService.get("idUser");

    let form = new FormData();

      for(let i = 0; i < this.requData.Files.length; i++){
        form.append("filecollect", this.requData.Files[i] )
      }

      let filtersid = "";

      for(let i = 0; i < this.requData.FiltersValue.length; i++){
        filtersid += this.requData.FiltersValue[i]
        if(i != this.requData.FiltersValue.length - 1){
          filtersid+="|"
        }
      }

    /*  this.requData.idUser = "2"
      this.requData.Title = "Title test"
      this.requData.Describe = "describe test"
      this.requData.Category = "1"
      this.requData.Price = "123"
      this.requData.Phone = "84239847239"
      this.requData.IsDelivery = true
      this.requData.isNegotiatedPrice = false
      this.requData.Quality = "Новое"
      this.requData.TypeAd = "Бизнес"
*/

      this.httpService.createAds(form,filtersid, this.requData).subscribe(res => {
        this.route.navigate([`/card-ad/${res}`]);
      }, err => {
        alert(err);
      });
    
  }


}
