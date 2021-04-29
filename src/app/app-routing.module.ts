import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './components/application/application.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ListApplicationComponent } from './components/list-application/list-application.component';
import { NewApplicationComponent } from './components/new-application/new-application.component';
import { MasterPageComponent } from './components/master-page/master-page.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { BiometricComponent } from './components/biometric/biometric.component';
import { ViewbiometricComponent } from './components/viewbiometric/viewbiometric.component';
import { OrdinarylistApplicationComponent } from './components/ordinarylist-application/ordinarylist-application.component';
import { RushlistApplicationComponent } from './components/rushlist-application/rushlist-application.component';
import { ExtralistApplicationComponent } from './components/extralist-application/extralist-application.component';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ApprovedlistComponent } from './components/approvedlist/approvedlist.component';

export const routes: Routes = [
  // {
  //   path: '', redirectTo: 'dashboard', pathMatch: 'full'
  // },
  { path: '', redirectTo: 'login',  pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'master-page', component: MasterPageComponent },
  { path: 'footer', component: FooterComponent },
  { path: '', redirectTo:'biometric',pathMatch:'full' },
  { path: 'biometric', component: BiometricComponent },
  { path: 'viewbiometric', component: ViewbiometricComponent },
  { path: 'ordinarylist-application', component: OrdinarylistApplicationComponent },
  { path: 'rushlist-application', component: RushlistApplicationComponent },
  { path: 'extralist-application', component: ExtralistApplicationComponent },
  { path: 'approvedlist', component: ApprovedlistComponent },
  { path: 'pending-list', component: PendingListComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full', },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'application',
        component: ApplicationComponent,
        children: [
          { path: '', redirectTo: 'new-application', pathMatch: 'full', },
          { path: 'new-application', component: NewApplicationComponent },
          { path: 'list-application', component: ListApplicationComponent }
        ]
      }
    ]
  },
  // { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
