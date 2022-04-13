import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { CookieService  } from 'ngx-cookie-service'; 
import { TypeAd } from 'src/app/Classes/typeAd';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RequEditAd } from 'src/app/Classes/Request/requ-edit-ad';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.component.html',
  styleUrls: ['./edit-ad.component.css']
})
export class EditAdComponent implements OnInit {

  Title : string = "title ad";
  Describe : string = "describe ad";

  private emptyImgUrl  = "../assets/imgs/emptyImg.png";

  private countImgs : number = 12;

  public Category : any;
  public idBrend : number = 0;

  public requData : any;

  public typeAd : TypeAd = new TypeAd();

  public forLoadFiles : File[] =  Array();

  urlImgs = new Array(this.countImgs);
  cancelBts : boolean[] = new Array(this.countImgs);


  constructor(private httpService : HttpService,
              private cookieService : CookieService,
              private activateRoute : ActivatedRoute,
              private sanitizer: DomSanitizer,
              private route : Router) {

                let idAd = this.activateRoute.snapshot.params['id'];

                for(let i = 0; i < this.countImgs; i++){
                  this.urlImgs[i] = this.emptyImgUrl;
                  this.cancelBts[i] = false;
                }

                this.httpService.getOneAd(idAd).subscribe(
                  res => {

                    this.requData = res;
                    console.log(res);

                    if(this.requData.IsError == true){
                      console.log("error");
                    }
                    this.countImgs = this.requData.countImgs;

                    this.requData.price = Number.parseFloat(this.requData.price);

                    for(let i = 0; i < this.countImgs; i++){
                      this.httpService.GetImgOfAd(idAd, i).subscribe(
                        imgBlob => {
                          const urlToBlob = window.URL.createObjectURL(imgBlob)  
                          this.urlImgs[i] = this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob);
                          this.cancelBts[i] = true;

                          let b2 = new Blob([imgBlob as BlobPart], { type: imgBlob.type });
                          let file : any = b2;
                          file.lastModified = Date.now.toString();
                          file.name = "application.png";
                          file.webkitRelativePathts = "";
                          this.forLoadFiles[i] = file;                         
                        }
                      )
                    }  
                    this.httpService.getCategories().subscribe( 
                      res => {
                        if(res instanceof Array){
                         this.typeAd.Categories = res;
                         this.Category = res[this.requData.idCategory];                        
                        }
                      }
                     )    
                     this.httpService.getBrands().subscribe( 
                       res => {
                         if(res instanceof Array){
                          this.typeAd.Brends = res;
                          this.requData.Brend = this.requData.idBrend;
                          console.log()
                         }
                       }
                      )

                  }
                )
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
          this.forLoadFiles.push(nowLoadedFile[idLoadedImg]);
          idLoadedImg++;
      }
      if(nowLoadedFile.length == idLoadedImg){
        return;
      }
    }
  }

  delImg(event: any){
    let indexUrl = event.target.getAttribute("id") as number;

    this.forLoadFiles.splice( indexUrl, 1 );

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

  EditAds(){    

    this.requData.idUser = this.cookieService.get("idUser");


    let form = new FormData();

      for(let i = 0; i < this.forLoadFiles.length; i++){
        form.append("filecollect", this.forLoadFiles[i] )
      }
     /*

      this.requData.Title = "Кокос";
      this.requData.Describe = "Кокос белый внутри";
      this.requData.Category = "1";
      this.requData.Brend = "1";
      this.requData.Price = "12";
      */

      let reqData : RequEditAd =  new RequEditAd();
      reqData.title = this.requData.title;
      reqData.describe = this.requData.describe;
      reqData.price = this.requData.price;
      reqData.idBrend = this.requData.Brend;
      reqData.idAd = this.activateRoute.snapshot.params['id'];


      this.httpService.editAds(form, reqData).subscribe(res => {
       if(res == true){
        this.route.navigate([`/card-ad/${reqData.idAd}`]);
       }
      }); 

  }


}
