import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-approvedlist',
  templateUrl: './approvedlist.component.html',
  styleUrls: ['./approvedlist.component.css'],
  providers: [DatePipe]
})
export class ApprovedlistComponent implements OnInit {

  @ViewChild('dataContainer') dataContainer: ElementRef;

  StaffId:any;
  ApplicationList : any;
  dtOptions: DataTables.Settings = {};
  myDate = new Date();
  dFormat:string;
  submitDate=new Date();  
  approvedDate : string;
  issueDate:string;

  constructor(
    private dataService:DataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.StaffId = localStorage.getItem("staffId");

    this.dataService.getApprovedListById(this.StaffId).subscribe(res=>{
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
      this.approvedDate=this.datePipe.transform(this.ApplicationList[0].ApprovalDate, 'dd/MM/yyyy');
      this.dataService.visaRefNo = this.ApplicationList[0].MyEVisaRefNo;
    },
    error=>{
      setTimeout(()=>{                          
        $('#datatableexample').DataTable( {
            pagingType: 'simple_numbers',
            pageLength: 10,
            processing: true,
            //lengthMenu : [5, 10, 25],
            order:[[1,"desc"]],
            "language": {
              "emptyTable": "No data available in table"
            }
          }) ;
        },1);
      
    }
    );
  }

  DownloadPDF(visaRefNo){
    this.dataService.getVisaDocumentsByVisaRefNo(visaRefNo).subscribe(res=>{
      console.log(res);
      let base64String = res;
    this.downloadPdf(base64String,"sample");
    });

  }

  downloadPdf(base64String, fileName){
    if(window.navigator && window.navigator.msSaveOrOpenBlob){ 
      // download PDF in IE
      let byteChar = atob(base64String);
      let byteArray = new Array(byteChar.length);
      for(let i = 0; i < byteChar.length; i++){
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], {type : 'application/pdf'});
      window.navigator.msSaveOrOpenBlob(blob, `${fileName}.pdf`);
    } else {
      // Download PDF in Chrome etc.
      const source = `data:application/pdf;base64,${base64String}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${fileName}.pdf`
      link.click();
    }
  }

  viewFile(visaRefNo){
    this.dataService.getVisaDocumentsByVisaRefNo(visaRefNo).subscribe(res=>{
      let base64String = res;
      this.dataContainer.nativeElement.innerHTML = res;

      var popup;
      if (popup && !popup.closed) {
        popup.focus();
        /* or do something else, e.g. close the popup or alert a warning */
      } else {
        var divText = this.dataContainer.nativeElement.innerHTML; //document.getElementById("pass").outerHTML;
        this.dataContainer.nativeElement.innerHTML ="";
        popup = window.open('', '', 'width=100%');
        var doc = popup.document;
        doc.open();
        doc.write(divText);
        doc.close();
      }
    });
  }

}
