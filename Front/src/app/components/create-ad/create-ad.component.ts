import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { CookieService  } from 'ngx-cookie-service'; 
import { TypeAd } from 'src/app/Classes/typeAd';
import { RequCreateAd } from 'src/app/Classes/Request/requ-create-ad';


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

  public typeAd : TypeAd = new TypeAd();

  public requData : RequCreateAd = new RequCreateAd();

  urlImgs : string[] = new Array(this.countImgs);
  cancelBts : boolean[] = new Array(this.countImgs);


  constructor(private httpService : HttpService,
              private cookieService : CookieService) 
              {
                this.requData.idUser = this.cookieService.get("idUser");

               for(let i = 0; i < this.urlImgs.length; i++){
                 this.urlImgs[i] = this.emptyImgUrl;
                 this.cancelBts[i] = false;
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
          this.cancelBts[i] = true;  
          this.urlImgs[i] = urlImg;     
          };
          reader.readAsDataURL(nowLoadedFile[idLoadedImg]);           
          this.requData.Files.push(nowLoadedFile);
          idLoadedImg++;
      }
      if(nowLoadedFile.length == idLoadedImg){
        return;
      }
    }
 
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

    for(let i = 0; i < this.requData.Files.length; i++){
      
    let formData_final = new FormData();
    formData_final.append("uploadedFile", this.requData.Files[i] )
    let files = formData_final

    this.httpService.createAds(files, this.requData).subscribe(res => {
      console.log(res);
    });
  }

  }


}
