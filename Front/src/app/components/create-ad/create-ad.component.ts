import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import {  CookieService  } from 'ngx-cookie-service'; 


@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  Title : string = "title ad";
  Describe : string = "describe ad";

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";


  LoadedImg : File[] = new Array();
  urlImgs : string[] = new Array(4);


  constructor(private httpService : HttpService,
              private cookieService : CookieService) 
              {
               for(let i = 0; i < this.urlImgs.length; i++){
                 this.urlImgs[i] = this.emptyImgUrl;
               }
              }

  ngOnInit(): void {
  }

  FileSelected(event : any){
   
    let target = event.target;
    let nowLoadedFile = target.files;

//       if ( !this.Imgs.type.startsWith("image/") ) {
  //      alert("Image only please....");
    //    }

      let idLoadedImg = 0;
     for(let i = 0; i < this.urlImgs.length; i++){

      if(this.urlImgs[i] == this.emptyImgUrl){
        let reader = new FileReader();

        reader.onloadend = () => {  
          let urlImg : any = reader.result;       
          this.urlImgs[i] = urlImg;
          };
          console.log(i);
          reader.readAsDataURL(nowLoadedFile[idLoadedImg]);           
          this.LoadedImg.push(nowLoadedFile[idLoadedImg]);
          idLoadedImg++;
      }
      if(nowLoadedFile.length == idLoadedImg){
        return;
      }
    }
 
  }

  delImg(event: any){
    let indexUrl = event.target.getAttribute("id") as number;

    this.LoadedImg.splice( indexUrl, 1 );

    for(; indexUrl < this.urlImgs.length;){  
        this.urlImgs[indexUrl] = this.urlImgs[++indexUrl]
        if(indexUrl == 3){
          this.urlImgs[indexUrl] = this.emptyImgUrl;
          return;
        }
    }
  }

  CreateAds(){    
    for(let i = 0; i < this.LoadedImg.length; i++){
      
    let formData_final = new FormData();
    formData_final.append("uploadedFile", this.LoadedImg[i] )
    let sendData = formData_final

    this.httpService.createAds(sendData,
         this.cookieService.get("idUser"),
          this.Title,
           this.Describe  ).subscribe(res => {
      console.log(res);
    });
  }

  }


}
