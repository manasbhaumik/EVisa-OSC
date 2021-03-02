import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {DataTablesModule} from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationComponent } from './components/application/application.component';
import { NewApplicationComponent } from './components/new-application/new-application.component';
import { ListApplicationComponent } from './components/list-application/list-application.component';
import { MatTreeModule } from '@angular/material/tree';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MasterPageComponent } from './components/master-page/master-page.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalPopupComponent } from './Modal/modal-popup/modal-popup.component';
import { BiometricComponent } from './components/biometric/biometric.component';
import { ViewbiometricComponent } from './components/viewbiometric/viewbiometric.component';
import { OrdinarylistApplicationComponent } from './components/ordinarylist-application/ordinarylist-application.component';
import { RushlistApplicationComponent } from './components/rushlist-application/rushlist-application.component';
import { ExtralistApplicationComponent } from './components/extralist-application/extralist-application.component';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    ApplicationComponent,
    NewApplicationComponent,
    ListApplicationComponent,
    MasterPageComponent,
    LoginComponent,
    FooterComponent,
    ModalPopupComponent,
    BiometricComponent,
    ViewbiometricComponent,
    OrdinarylistApplicationComponent,
    RushlistApplicationComponent,
    ExtralistApplicationComponent,
    PendingListComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatMenuModule,
    MatTreeModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatRadioModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalPopupComponent]
})
export class AppModule { }
