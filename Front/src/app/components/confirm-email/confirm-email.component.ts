import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { AlertMessage } from 'src/app/Classes/alert-message';
import { GlobalHubService } from 'src/app/global-hub.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(
    private activatedRoute : ActivatedRoute,
    private http : HttpService,
    private globalHub : GlobalHubService,
    private cookieService : CookieService,
    private router : Router
    ) { 
      let idUser = this.activatedRoute.snapshot.params['idUser'];

      let body = {
        idUser: idUser
      }

      this.http.confirmEmail(body).subscribe( 
        res => {
          let response : any = res;

          if(response.isError){
            let aMessage = new AlertMessage();
            aMessage.Message = response.message;

            this.globalHub.addAlertMessage(aMessage);
            return;
          }

          this.router.navigate(['/authorization']);

          let aMessage = new AlertMessage();
          aMessage.Title = "Успішно";
          aMessage.Message = "Вашу пошту було успішно підтверджено"
          this.globalHub.addAlertMessage(aMessage);

        },
        err => {
          this.globalHub.addAlertMessage(new AlertMessage());
        }
       )
    }

  ngOnInit(): void {
  }

}
