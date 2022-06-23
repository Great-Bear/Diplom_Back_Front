import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { Page404Component } from './components/page404/page404.component';
import { AboutComponent } from './components/about/about.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';

import { HttpClientModule } from '@angular/common/http';
import { EmailconfirmComponent } from './components/emailconfirm/emailconfirm.component';
import { CreateAdComponent } from './components/create-ad/create-ad.component';
import { MyadsComponent } from './components/myads/myads.component';
import { EditAdComponent } from './components/edit-ad/edit-ad.component';
import { CardAdComponent } from './components/card-ad/card-ad.component';
import { ModerPageComponent } from './components/moder-page/moder-page.component';
import { ListAdsComponent } from './components/list-ads/list-ads.component';
import { MyFavoriteComponent } from './components/my-favorite/my-favorite.component';
import { ChatComponent } from './components/chat/chat.component';
import { MyChatsComponent } from './components/my-chats/my-chats.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { AdminControllerComponent } from './components/admin-controller/admin-controller.component';
import { ModersComponent } from './components/moders/moders.component';
import { FiltersControllerComponent } from './components/filters-controller/filters-controller.component';
import { AddModerComponent } from './components/add-moder/add-moder.component';
import { CellAdComponent } from './components/cell-ad/cell-ad.component';

const itemRoutesModer: Routes = [
  { path: 'add', component: AddModerComponent},
]

const itemRoutesAdmin: Routes = [
  { path: 'moders', component: ModersComponent, children : itemRoutesModer},
  { path: 'filters', component: FiltersControllerComponent},
];




const appRoutes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'about', component: AboutComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'authorization', component: AuthorizationComponent},
  { path: 'emailconfirm', component: EmailconfirmComponent},
  { path: 'create-ad', component: CreateAdComponent},
  { path: 'edit-ad/:id', component: EditAdComponent},
  { path: 'my-ads', component: MyadsComponent}, 
  { path: 'myfavorite', component: MyFavoriteComponent},
  { path: 'myfavorite/card-ad/:id', component: CardAdComponent},
  { path: 'card-ad/:id',component: CardAdComponent},
  { path: 'moderPage', component: ModerPageComponent},
  { path: 'list_ads/:idCategory/:searchQuery', component: ListAdsComponent},
  { path: 'list_ads/:idCategory', component: ListAdsComponent},
  { path: 'list_ads', component: ListAdsComponent},
  { path: 'ModersComponent', component: AdminControllerComponent},
  { path: 'ModersComponent', component: AdminControllerComponent, children: itemRoutesAdmin},
  { path: 'admin_controller', component: AdminControllerComponent},
  { path: 'confirm_Email/:idUser', component: ConfirmEmailComponent},
  { path: 'mychats', component: MyChatsComponent},
  { path: 'chat/:idChat', component: ChatComponent},
  { path: '', component: HomeComponent},
  { path: '**', component: Page404Component }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Page404Component,
    AboutComponent,
    RegistrationComponent,
    AuthorizationComponent,
    EmailconfirmComponent,
    CreateAdComponent,
    MyadsComponent,
    EditAdComponent,
    CardAdComponent,
    ModerPageComponent,
    ListAdsComponent,
    MyFavoriteComponent,
    ChatComponent,
    MyChatsComponent,
    ConfirmEmailComponent,
    AdminControllerComponent,
    ModersComponent,
    FiltersControllerComponent,
    AddModerComponent,
    CellAdComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
