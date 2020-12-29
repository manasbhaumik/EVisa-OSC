import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './components/application/application.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { ListApplicationComponent } from './components/list-application/list-application.component';
import { NewApplicationComponent } from './components/new-application/new-application.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full'
  },
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
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
