import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from  '@angular/router';
import { DataService } from 'src/app/Services/data.service' 

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css']
})
export class MasterPageComponent implements OnInit {

  userName:string;
  countryID : number;
  contactID : number;
  params : any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private dataService:DataService
  ) { }

  ngOnInit(): void {
    this.userName=this.tokenStorage.getUser();
    this.dataService.getContact().subscribe((data:any)=>{
      this.countryID=data.CountryID;
      this.contactID=data.ContactID;      
    }); 
    this.params = encodeURIComponent('applicationId:');
  }

  logOut(){
    this.tokenStorage.signOut();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

}
