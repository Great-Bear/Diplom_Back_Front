import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-card-ad',
  templateUrl: './card-ad.component.html',
  styleUrls: ['./card-ad.component.css']
})
export class CardAdComponent implements OnInit {

  data : any;
  imgs : any;
  firstImg : any;
  isOwner = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private http : HttpService,
    private sanitizer: DomSanitizer,
    private cookie : CookieService) {  
  }

  ngOnInit(): void {
    try {
      let idAd = this.activateRoute.snapshot.params['id'];

      this.http.getOneAd(idAd).subscribe(
        res => {

          this.data = res;

          if(this.data.countImgs == 0){
              this.firstImg = "../assets/imgs/emptyImg.png";
            return;
          }
          this.imgs = new Array(this.data.countImgs - 1)
          
          if(this.data.isError){
            console.log(this.data.error)
          }

          if(this.cookie.get("idUser") == this.data.idOwner){
            this.isOwner = true;
          }

          this.http.GetImgOfAd(idAd, 0).subscribe(
            imgBlob => {
              const urlToBlob = window.URL.createObjectURL(imgBlob)  
              this.firstImg = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
            }
          )

          for(let i = 1; i < this.data.countImgs; i++){
          this.http.GetImgOfAd(idAd, i).subscribe(
            imgBlob => {
              const urlToBlob = window.URL.createObjectURL(imgBlob)  
              this.imgs[i - 1] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);                
           
            }
          )
          console.log(this.imgs);
        }
        }
      )
    } catch (error) {
      console.log("Ошибка загрузки товара")
    }
  }

}
