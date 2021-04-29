import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef,MatDialogConfig ,MAT_DIALOG_DATA} from  '@angular/material/dialog';
import { AuthenticationServiceService } from 'src/app/Services/authentication-service.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { ModalPopupComponent } from 'src/app/Modal/modal-popup/modal-popup.component';
import { DataService } from 'src/app/Services/data.service';

export class User{
  public email:string;
  public password:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user=new User();
  fieldTextType : boolean;  
  returnUrl: string;
  error = '';
  closeResult: string;
  divLogin : boolean = true;
  divSignup : boolean = false;
  divError : boolean = false;

  constructor(
    private http: HttpClient,
    private dataService:DataService,
    private route: ActivatedRoute,
    private router: Router,
    private authentictionService:AuthenticationServiceService,
    private  dialog:  MatDialog,
    // private authService: AuthService, 
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  singUp(){
    this.divLogin = false;
    this.divSignup = true;
  }

  singIn(){
    this.divLogin = true;
    this.divSignup = false;

  }

  login(){
    this.authentictionService.userAuthentication(this.user.email,this.user.password)
      .subscribe((data:any)=>{//console.log(data);
      this.tokenStorage.saveToken(data.access_token);
      this.tokenStorage.saveUser(data.userName);
      this.dataService.getContact().subscribe((data:any)=>{
        if(data.StaffID == null)
        {
          //alert("1");
          this.error = "You are not authorized to Login"
          this.divError = true;
        }
        else{
          //alert("2");
          if(data.StaffID == ""){
            this.error = "You are not authorized to Login"
            this.divError = true;
          }
          this.router.navigate(['/home/dashboard']).then(() => {
            window.location.reload();
          });
        }
      });
      
    //   var dialogRef= this.dialog.open(ModalPopupComponent,{ data: {
    //     message : "Hi, "+ data.userName +" , Welcome to OSC portal",
    //     title : "Success",
    //     buttonText : "Ok"
    //   }});  
    //   dialogRef.afterClosed().subscribe(
    //     result => {
    //      this.returnUrl = result;
    //      this.router.navigate(['/home/dashboard']).then(() => {
    //        window.location.reload();
    //      });
    //     }
    //  ); 
        
    },
    error=>{
      this.error=error;//alert(error.error.error_description);
      this.error = error.error.error_description;
      this.divError = true;
      // var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
      //   message : error.error.error_description,
      //   title : "Alert!",
      //   buttonText : "Cancel"
      // }});
      // dialogRef.afterClosed().subscribe(result => {
      //   this.returnUrl = result;
      //   result ? this.router.navigate(['/login']): this.router.navigate(['/login']);
      // });   
    });
    
  }

  

}
