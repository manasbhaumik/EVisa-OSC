import { Component, OnInit,ElementRef,Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Router,ActivatedRoute } from  '@angular/router';
import { MatDialog, MatDialogRef,MatDialogConfig ,MAT_DIALOG_DATA} from  '@angular/material/dialog';
import { tap, switchMap, filter } from 'rxjs/operators';
import { forkJoin, Observable, empty, fromEvent, BehaviorSubject } from 'rxjs';
// import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { DataService } from 'src/app/Services/data.service';
import {ModalPopupComponent} from 'src/app/Modal/modal-popup/modal-popup.component';
import { DomSanitizer } from '@angular/platform-browser';

declare var smartWizard :any;

@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.css'],
  providers: [DatePipe]
})
export class BiometricComponent implements OnInit {
  @ViewChild('txtCountryCode', { static: false }) txtCountryCode: ElementRef;
  @ViewChild('txtYear', { static: false }) txtYear: ElementRef; 
  @ViewChild('txtMonth', { static: false }) txtMonth: ElementRef;
  @ViewChild('txtIOACode', { static: false }) txtIOACode: ElementRef;
  @ViewChild('txtRunningNo', { static: false }) txtRunningNo: ElementRef;
  @ViewChild('txtNRICNo', { static: false }) txtNRICNo: ElementRef;
  @ViewChild('txtPassportNo', { static: false }) txtPassportNo: ElementRef;
  @ViewChild('txtName', { static: false }) txtName: ElementRef;
  
  @ViewChild('video', { static: false }) videoElement: ElementRef;
  @ViewChild('video1', { static: false }) videoElement1: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('canvas1', { static: false }) canvas1: ElementRef;

  videoWidth = 0;
  videoHeight = 0;
  localstream : any;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };

  applicantInfoList : any;
  dFormat : string;
  applicationId : number;
  applicationList : any;
  visaRefNo : string;
  countryCode : any;
  year : any;
  month : any;
  ioaCode : any;
  rNo : any;
  applicantName : any;
  nricNo : any;
  passportNo : any;
  isSubmitted = false;
  error : string;
  returnUrl : string;
  picture : any;
  divApplicationInfo : boolean = true;
  divFaceCapturing : boolean = true;
  divSuccess : boolean =true;
  divError : boolean =true;
  divFingerSuccess : boolean =true;
  divFingerError : boolean =true;
  faceData : any;
  imageurl : any;
  docList : any;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;
  imageSrc: string;
  

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private router: Router,
    private dataService:DataService,
    private datePipe: DatePipe,
    private  dialog:  MatDialog,
    private activeRouter:ActivatedRoute,
    private sanitizer: DomSanitizer
    // private ngOpenCVService: NgOpenCVService
  ) { }

  get f() { return this.applicantInfoForm.controls; }

  applicantInfoForm = this.fb.group({
    visaRefNo:['',Validators.required]
  });

  get f1() { return this.uploadPhotoForm.controls; }

  // uploadForm = this.fb.group({
  //   profile: ['']
  // });
  // uploadPhotoForm = new FormGroup({
  //   //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //   profile: new FormControl('', [Validators.required]),
  //   fileSource: new FormControl('', [Validators.required])
  // });

  uploadPhotoForm = this.fb.group({
    profile:['',Validators.required],
    fileSource :['',Validators.required]
  });

  myForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f1(){  return this.myForm.controls; }

  myForm1 = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file1: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f2(){  return this.myForm1.controls; }

  myForm2 = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file2: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f3(){  return this.myForm2.controls; }

  myForm3 = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file3: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f4(){  return this.myForm3.controls; }

  myForm4 = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file4: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f5(){  return this.myForm4.controls; }

  myForm5 = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file5: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f6(){  return this.myForm5.controls; }

  myForm6 = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file6: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  // get f7(){  return this.myForm6.controls; }


  // onFileChange(event) {
  
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.myForm.patchValue({
  //       fileSource: file
  //     });
  //   }
  // }

  ngOnInit(): void {
    //this.loadScript('https://res.cloudinary.com/dxfq3iotg/raw/upload/v1581152197/smartwizard/jquery.smartWizard.min.js');
    // this.visaRefNo = this.dataService.visaRefNo;
    // this.dataService.visaRefNo = "";
    // this.applicantInfoForm.controls['visaRefNo'].setValue(this.visaRefNo);
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {alert("refresh");
    //   return false;
    // };
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['/biometric']);
    let currentUrl = this.router.url;//alert(currentUrl);
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //     //this.router.navigate([currentUrl]);alert(currentUrl);
    // });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);

    this.divApplicationInfo = false;
    this.divFaceCapturing = false;
    this.divSuccess = false;
    this.divError =false;
    this.divFingerSuccess =false;
    this.divFingerError = false;

    this.activeRouter.params.subscribe(params => {
      var applicationId = params['applicationId'];
      this.visaRefNo=applicationId; 
      if(this.visaRefNo !==undefined){
        this.visaRefNo=applicationId; 
        this.applicantInfoForm.controls['visaRefNo'].setValue(this.visaRefNo);
      }
      else{
        //alert("1");
        this.visaRefNo=""; 
        this.applicantInfoForm.controls['visaRefNo'].setValue("");
      }
      
    }); 
  }

  displayImage(){

    this.dataService.getDocumentsByVisaRefNo(this.visaRefNo).subscribe(res=>{
      this.docList =res;
      //console.log(this.docList);
      let objectURL = 'data:image/png;base64,' + this.docList;
      //console.log(objectURL);
      this.faceData = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
       //this.imageurl = this.docList[0].DocFile;
       //console.log(this.faceData);
      // this.dataService.downloadDataAsBase64(this.imageurl)
      // .subscribe((base64Data: string) => {
      //   this.faceData = base64Data;
      // });

    });

  }

  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  getApplicantInfo(){
    this.divApplicationInfo = true;
    this.isSubmitted = true;
    if(this.applicantInfoForm.invalid){
    this.divApplicationInfo =false;
      return;
    }

    var refNo =  this.applicantInfoForm.controls['visaRefNo'].value;
    this.dataService.getApplicantPreviewByVisaRefNo(refNo).subscribe(res=>{
      this.applicantInfoList=res;
      if(res == null){
        this.applicantInfoList = null;
        var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
          message : "Reference number does not exists",
          title : "Alert!",
          buttonText : "Cancel"
        }});
        dialogRef.afterClosed().subscribe(result => {
          //console.log('The dialog was closed',result);
          this.returnUrl = result;
          result ? this.router.navigate(['/home']): this.router.navigate(['/biometric',{applicationId : this.visaRefNo}]);
        });
      }
      else{
        if(!this.applicantInfoList?.length){
          var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
            message : "Reference number does not exists",
            title : "Alert!",
            buttonText : "Cancel"
          }});
          dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed',result);
            this.returnUrl = result;
            result ? this.router.navigate(['/home']): this.router.navigate(['/biometric',{applicationId:this.visaRefNo}]);
          });
        }
        else{
          //this.applicantInfoList=res;
          //console.log(this.applicantInfoList);
          this.renderer.setProperty(this.txtCountryCode.nativeElement, 'value', this.applicantInfoList[0].CountryCode);
          this.countryCode =this.applicantInfoList[0].CountryCode;
          this.renderer.setProperty(this.txtYear.nativeElement, 'value', this.applicantInfoList[0].Year);
          this.year = this.applicantInfoList[0].Year;         
          this.renderer.setProperty(this.txtMonth.nativeElement, 'value', this.applicantInfoList[0].Month);
          this.month = this.applicantInfoList[0].Month;
          this.renderer.setProperty(this.txtIOACode.nativeElement, 'value', this.applicantInfoList[0].IOACode);
          this.ioaCode = this.applicantInfoList[0].IOACode;
          this.renderer.setProperty(this.txtRunningNo.nativeElement, 'value', this.applicantInfoList[0].RNo);
          this.rNo = this.applicantInfoList[0].RNo;
          this.renderer.setProperty(this.txtNRICNo.nativeElement, 'value', this.applicantInfoList[0].IDNumber);
          this.nricNo = this.applicantInfoList[0].IDNumber;
          this.renderer.setProperty(this.txtPassportNo.nativeElement, 'value', this.applicantInfoList[0].PassportNo);
          this.passportNo = this.applicantInfoList[0].PassportNo;
          this.renderer.setProperty(this.txtName.nativeElement, 'value', this.applicantInfoList[0].FullName);
          this.applicantName = this.applicantInfoList[0].FullName;
        }
      }
    },
    error =>{
      var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
        message : "Record Not found",
        title : "Alert!",
        buttonText : "Cancel"
      }});
      dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed',result);
        this.returnUrl = result;
        result ? this.router.navigate(['/agency-details']): this.router.navigate(['/biometric',{applicationId:this.visaRefNo}]);
      });
    });

  }

  onFaceClick(){
    this.divApplicationInfo =false;
    this.divFaceCapturing =true;    
   // this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
        alert('Sorry, camera not available.');
    }
  }

  attachVideo(stream) {
    //console.log(stream);
    this.localstream = stream;
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
        this.videoHeight = this.videoElement.nativeElement.videoHeight;
        this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
    // this.renderer.setProperty(this.videoElement1.nativeElement, 'srcObject', stream);
    // this.renderer.listen(this.videoElement1.nativeElement, 'play', (event) => {
    //     this.videoHeight = this.videoElement1.nativeElement.videoHeight;
    //     this.videoWidth = this.videoElement1.nativeElement.videoWidth;
    // });
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement1.nativeElement, 0, 0);
    //this.canvas.nativeElement.getContext('2d').fillRect(this.videoElement.nativeElement, 25, 25, 100, 100);
    this.picture = this.canvas.nativeElement.toDataURL("image/png");
    
    this.videoElement1.nativeElement.pause();
    if (this.localstream.stop) {
      this.localstream.stop();
    }
    if (this.localstream.getVideoTracks) {
      this.localstream.getVideoTracks().forEach((track: any) => {
        track.stop();
      });
    }
  }

  savePhoto(){
    //var blob=this.dataURItoBlob(this.picture);
    //console.log(blob);
    this.capture();
    this.localstream.getVideoTracks()[0].stop();
    var base64 = this.picture.replace(/^data:image\/(png|jpg);base64,/, "");
    //console.log(base64);
    //console.log(this.picture);
    // this.dataService.saveDocuments(this.visaRefNo,'Face Capture','png',base64).subscribe((data:any)=>{     
    //   this.divSuccess = true;
    // },
    // error=>{
    //   this.error=error.error.Message;     
    //   this.divError = true;
    // });
    this.divSuccess = true;
  }

  saveFinger(){
    //var blob=this.dataURItoBlob(this.picture);
    //console.log(blob);
    this.localstream.getVideoTracks()[0].stop();
    //var base64 = this.picture.replace(/^data:image\/(png|jpg);base64,/, "");
    //alert(this.visaRefNo);
    //console.log("Size :"+blob.size);console.log("Type :"+blob.type);
    //console.log("Image : "+ this.picture.replace(/^data:image\/(png|jpg);base64,/, ""));
    //console.log(base64);
    //console.log(this.picture);
    // this.dataService.saveDocuments(this.visaRefNo,'Finger Capture','png',base64).subscribe((data:any)=>{
     
    //   this.divFingerSuccess = true;
    // },
    // error=>{
    //   this.error=error.error.Message;
      
    //   this.divFingerError = true;
    // });
    this.divFingerSuccess = true;
  }

  submit(){
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);

    this.dataService.saveDocuments(this.visaRefNo,'Passport','png',formData).subscribe((data:any)=>{
     
      //this.divFingerSuccess = true;
    },
    error=>{
      this.error=error.error.Message;
      
      //this.divFingerError = true;
    });
   
    
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;
     
        this.uploadPhotoForm.patchValue({
          fileSource: reader.result
        });
   
      };
   
    }
  }

  onPhotoSubmit(){
    this.isSubmitted = true;
    if(this.uploadPhotoForm.invalid){
      return;
    }
    var photo = this.imageSrc;//this.uploadPhotoForm.value;
    var photofile = photo;//photo.fileSource;
    //console.log(photofile);
    //this.picture.replace(/^data:image\/(png|jpg);base64,/, "");
    // var picture=photofile.replace("data:image/jpeg;base64,/", "");
    var picture=photofile.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    //console.log(picture);
    this.dataService.saveDocuments(this.visaRefNo,'Face Capture','png',picture).subscribe((data:any)=>{
      this.divSuccess = true;
    },
    error =>{
      this.error=error.error.Message;
      this.divError = true;
    });
    
    
  }


  // onFileSelect(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.uploadForm.get('profile').setValue(file);
  //   }
  // }

  // onSubmit() {
  //   const formData = new FormData();
  //   formData.append('file', this.uploadForm.get('profile').value);
  //   console.log(formData);
  //   console.log(this.uploadForm.get('profile').value);

  //   // this.dataService.saveDocuments(this.visaRefNo,'Face Capture','png',formData).subscribe((data:any)=>{
     
  //   //   //this.divFingerSuccess = true;
  //   // },
  //   // error=>{
  //   //   this.error=error.error.Message;
      
  //   //   //this.divFingerError = true;
  //   // });
  //   this.divSuccess = true;
    
  // }

  

  

}
