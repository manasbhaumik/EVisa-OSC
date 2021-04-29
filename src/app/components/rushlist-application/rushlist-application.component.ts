import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DatePipe } from '@angular/common';
import { Subscription, interval } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-rushlist-application',
  templateUrl: './rushlist-application.component.html',
  styleUrls: ['./rushlist-application.component.css'],
  providers: [DatePipe]
  
})
export class RushlistApplicationComponent implements OnInit {

  StaffId:any;
  ApplicationList : any;
  dtOptions: DataTables.Settings = {};
  myDate = new Date();
  dFormat:string;
  submitDate=new Date();
  issueDate:string;
  day:any;
  hour:any;
  minutes:any;
  seconds:any;
  timedifference:any;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;
  subDate : any;
  CurDate : any;
  dDay = new Date('Mar 25 2021 16:00:00');
  subscription: Subscription;
 

  constructor(
    private dataService:DataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.StaffId = localStorage.getItem("staffId");

    this.dataService.getRushApplicationsById(this.StaffId).subscribe(res=>{
      this.ApplicationList =res;
      
      var ttl = this.ApplicationList.length;
      this.subscription = interval(1000).subscribe(x => { 
        this.getTimeDifference(ttl,this.ApplicationList); 
       //this.ApplicationList.push(this.ApplicationList);
      });

      setTimeout(()=>{                          
       $('#datatableexample').DataTable( {
           pagingType: 'simple_numbers',
           pageLength: 10,
           processing: true,
           order:[[3,"desc"]]
         }) ;
      },1);
 
            
      
    });
    // this.ApplicationList = interval(1000).subscribe(x=>{
    //  this.ApplicationList.push(x)  ;

    // });

  }

  getTimeDifference (ttl, ApplicationLists) { 
    
    for(let i=0;i<ttl;i++){
      //alert(i);
      var subDate = new Date();
     subDate = this.ApplicationList[i].SubmissionDate;
     //this.datePipe.transform(this.ApplicationList[i].SubmissionDate, 'EEE MMM d y h:mm:ss  ZZZZ');
     //this.timedifference = this.subDate.getTime() - new  Date().getTime();
      this.timedifference =  this.dDay.getTime() - new Date().getTime(); //this.ApplicationList[0].MilliSecondsLeft;//this.dDay.getTime() - new  Date().getTime();
      //alert(this.timedifference);
      //console.log(this.timedifference);
      this.allocateTimeUnits(this.timedifference,ApplicationLists[i].DaysLeft,ApplicationLists[i].HoursRemaining,ApplicationLists[i].MinutesRemaining,ApplicationLists[i].SecondsRemaining);


    }
  }

  allocateTimeUnits (timeDifference,days,hours,minuutes,seconds) {
    this.seconds = seconds;// Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutes = minuutes;// Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hour = hours;// Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.day =days;// Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}

}
