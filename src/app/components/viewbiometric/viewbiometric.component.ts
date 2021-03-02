import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from  '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { ModalPopupComponent } from 'src/app/Modal/modal-popup/modal-popup.component';
import { MatDialog, MatDialogRef,MatDialogConfig ,MAT_DIALOG_DATA} from  '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-viewbiometric',
  templateUrl: './viewbiometric.component.html',
  styleUrls: ['./viewbiometric.component.css'],
  providers: [DatePipe]
})
export class ViewbiometricComponent implements OnInit {

  StaffId:any;
  ApplicationList : any;
  applicantInfoList : any;
  dtOptions: DataTables.Settings = {};
  myDate = new Date();
  dFormat:string;
  submitDate=new Date();
  issueDate:string;
  faceData : any;
  imageurl : any;
  docList : any;
  divDisplayImage : boolean = false;

  constructor(
    private dataService:DataService,
    private datePipe: DatePipe,    
    private router: Router,
    private sanitizer: DomSanitizer,
    private  dialog:  MatDialog
  ) { }

  ngOnInit(): void {
    this.StaffId = localStorage.getItem("staffId");//this.dataService.staffId;//alert(this.dataService.staffId);

   
    
    this.dataService.getBioMetricListById(this.StaffId).subscribe(res=>{
     this.ApplicationList =res;
     setTimeout(()=>{                          
      $('#datatableexample').DataTable( {
          pagingType: 'simple_numbers',
          pageLength: 10,
          processing: true,
          //lengthMenu : [5, 10, 25],
          order:[[1,"desc"]]
        }) ;
      },1);
     this.submitDate = this.ApplicationList[0].SubmissionDate;
     this.issueDate=this.datePipe.transform(this.submitDate, 'dd/MM/yyyy');
     this.dataService.visaRefNo = this.ApplicationList[0].MyEVisaRefNo;
    });
  }

  viewPhoto(visaRefNo){
    //window.location.reload();
    this.reloadCurrentRoute();
    // setTimeout(() => {      
    // }, 1000);
    this.dataService.getDocumentsByVisaRefNo(visaRefNo).subscribe(res=>{
      this.docList =res;
      //console.log(this.docList);
      let objectURL = 'data:image/jpeg;base64,' + this.docList;
      //let objectURL = this.docList;
      //console.log(objectURL);
      this.faceData = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
      
    });

    this.dataService.getApplicantPreviewByVisaRefNo(visaRefNo).subscribe(res=>{
      this.applicantInfoList = res;
    });
    
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    // alert(currentUrl);
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //     this.router.navigate([currentUrl]);
    // });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
}


}
