import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.css'],
  providers: [DatePipe]
})
export class ListApplicationComponent implements OnInit {

  StaffId:any;
  ApplicationList : any;
  dtOptions: DataTables.Settings = {};
  myDate = new Date();
  dFormat:string;
  submitDate=new Date();
  issueDate:string;

  constructor(
    private dataService:DataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.StaffId = localStorage.getItem("staffId");//this.dataService.staffId;//alert(this.dataService.staffId);

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   lengthMenu : [5, 10, 25],
    //   processing: true
    // };

    this.dataService.getRecentApplicationsById(this.StaffId).subscribe(res=>{
     this.ApplicationList =res;
     setTimeout(()=>{                          
      $('#datatableexample').DataTable( {
          pagingType: 'simple_numbers',
          pageLength: 10,
          processing: true,
          //lengthMenu : [5, 10, 25],
          order:[[5,"desc"]]
        }) ;
      },1);

     this.submitDate = this.ApplicationList[0].SubmissionDate;
     this.issueDate=this.datePipe.transform(this.submitDate, 'dd/MM/yyyy');
     this.dataService.visaRefNo = this.ApplicationList[0].MyEVisaRefNo;
    });
  }

}
