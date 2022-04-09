import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';


@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.component.html',
  styleUrls: ['./edit-ad.component.css']
})
export class EditAdComponent implements OnInit {

  constructor(private http : HttpService) { }

  ngOnInit(): void {
  }

  FileSelected(event : any){
    let target = event.target;
    let nowLoadedFile = target.files;

    let form = new FormData();
    

    

    form.append("filecollect", nowLoadedFile[0] )
    form.append("filecollect", nowLoadedFile[0] )
    

    this.http.LoadMuchFiles(form).subscribe(
      res => {
        console.log(res);
      }
    )
  }

}
