import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  StaffId:any;
  TtlApplicationCnt:any;
  TtlCurrentCnt:any;
  TtlPendingCnt:any;
  TtlApprovedCnt:any;
  RecentApplicationList:any;
  constructor(
    private dataService:DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getContact().subscribe((data:any)=>{
      //console.log(data);
      this.StaffId = data.StaffID;
      this.dataService.staffId = data.StaffID;
      localStorage.setItem('staffId',this.StaffId);

      this.dataService.getDashboardCountById(this.StaffId).subscribe((data:any)=>{
        //console.log(data);
       this.TtlApplicationCnt =data;
      });

      this.dataService.getDashboardCurrentCountById(this.StaffId).subscribe((data:any)=>{
        //console.log(data);
       this.TtlCurrentCnt =data;
      });

      this.dataService.getDashboardPendingCountById(this.StaffId).subscribe((data:any)=>{
        //console.log(data);
       this.TtlPendingCnt =data;
      });

      this.dataService.getDashboardApprovedCountById(this.StaffId).subscribe((data:any)=>{
        //console.log(data);
       this.TtlApprovedCnt =data;
      });
  
      this.dataService.getDashboardRecentApplicationsById(this.StaffId).subscribe(res=>{
        //console.log(res);
       this.RecentApplicationList =res;
      });



    });

    

  }

}
