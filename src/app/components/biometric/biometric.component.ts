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
import { data } from 'jquery';

declare var smartWizard :any;
declare var Webcam : any;

@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.css'],
  providers: [DatePipe]
})
export class BiometricComponent implements OnInit {
  @ViewChild('txtCountryCode') txtCountryCode: ElementRef;
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

  @ViewChild('Camera', { static: false }) CameraElement: ElementRef;

  @ViewChild('displayScanDoc') displayScanDoc: ElementRef;

  videoWidth = 0;
  videoHeight = 0;
  localstream : any;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },//132
      height: { ideal: 2160 }//189
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
  divFingerCapturing : boolean = true;
  divDocuments : boolean = true;
  divSuccess : boolean =true;
  divError : boolean =true;
  divFaceCaptureError : boolean =true;
  divFingerSuccess : boolean =true;
  divFingerError : boolean =true;
  divDocumentSuccess : boolean = true;
  divDocumentError : boolean = true;
  faceData : any;
  imageurl : any;
  docList : any;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  FaceCaptureSuccessMessage = '';
  FaceCaptureErrorMessage = '';
  FingerSuccessMessage ='';
  FingerErrorMessage ='';
  DocumentSuccessMessage ='';
  DocumentErrorMessage ='';

  fileInfos?: Observable<any>;
  imageSrc: string;

  saveSuccess ='N';
  capturePhotoSuccess = 'N';

  displayScanDocuments : any;
  

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

  //get f1() { return this.uploadPhotoForm.controls; }

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

  get f1(){  return this.UploadPassportForm.controls; }

  UploadPassportForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    uploadPassport: new FormControl('', [Validators.required]),
    //fileSource: new FormControl('', [Validators.required])
  });

  get f2(){  return this.UploadNRICForm.controls; }

  UploadNRICForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    UploadNRIC: new FormControl('', [Validators.required]),
    //fileSource: new FormControl('', [Validators.required])
  });

  get f3(){  return this.UploadFlightForm.controls; }

  UploadFlightForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    UploadFlight: new FormControl('', [Validators.required]),
    //fileSource: new FormControl('', [Validators.required])
  });

  get f4(){  return this.UploadFundForm.controls; }

  UploadFundForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    UploadFund: new FormControl('', [Validators.required]),
    //fileSource: new FormControl('', [Validators.required])
  });

  get f5(){  return this.UploadYellowFeverForm.controls; }

  UploadYellowFeverForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    UploadYellowFever: new FormControl('', [Validators.required]),
    //fileSource: new FormControl('', [Validators.required])
  });

  get f6(){  return this.UploadCovid19Form.controls; }

  UploadCovid19Form = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    UploadCovid19: new FormControl('', [Validators.required]),
    //fileSource: new FormControl('', [Validators.required])
  });

  get f7(){  return this.UploadSponsorForm.controls; }

  UploadSponsorForm = new FormGroup({
    //name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    UploadSponsor: new FormControl(''),
    //fileSource: new FormControl('', [Validators.required])
  });

  


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
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate([currentUrl]);

    this.divApplicationInfo = false;
    this.divFaceCapturing = false;
    this.divFingerCapturing = false;
    this.divDocuments = false;
    this.divSuccess = false;
    this.divError =false;
    this.divFaceCaptureError =false;
    this.divFingerSuccess =false;
    this.divFingerError = false;
    this.divDocumentSuccess = false;
    this.divDocumentError = false;

    this.activeRouter.params.subscribe(params => {
      var applicationId = params['applicationId'];
      this.visaRefNo=applicationId; 
      //alert(this.visaRefNo);
      if(this.visaRefNo !==undefined){//alert("1");
        this.visaRefNo=applicationId; 
        this.applicantInfoForm.controls['visaRefNo'].setValue(this.visaRefNo);
      }
      else{
        //alert("2");
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
    //this.divApplicationInfo = true;
    this.isSubmitted = true;
    if(this.applicantInfoForm.invalid){
    this.divApplicationInfo =false;
      return;
    }
    else{
     // this.divApplicationInfo = true;
    }

    var refNo =  this.applicantInfoForm.controls['visaRefNo'].value;
    this.dataService.getApplicantPreviewByVisaRefNo(refNo).subscribe(res=>{
      this.applicantInfoList=res;
      if(res == null){
        this.applicantInfoList = null;
        this.error = "Reference number does not exists";
        this.divError = true;
        this.divApplicationInfo = false;
        // var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
        //   message : "Reference number does not exists",
        //   title : "Alert!",
        //   buttonText : "Cancel"
        // }});
        // dialogRef.afterClosed().subscribe(result => {
        //   //console.log('The dialog was closed',result);
        //   this.returnUrl = result;
        //   result ? this.router.navigate(['/home']): this.router.navigate(['/biometric',{applicationId : this.visaRefNo}]);
        // });
      }
      else{
        if(!this.applicantInfoList?.length){
          this.error =  "Reference number does not exists";
          this.divError = true;
          this.divApplicationInfo = false;
          // var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
          //   message : "Reference number does not exists",
          //   title : "Alert!",
          //   buttonText : "Cancel"
          // }});
          // dialogRef.afterClosed().subscribe(result => {
          //   //console.log('The dialog was closed',result);
          //   this.returnUrl = result;
          //   result ? this.router.navigate(['/home']): this.router.navigate(['/biometric',{applicationId:this.visaRefNo}]);
          // });
        }
        else{
          //this.applicantInfoList=res;
          //console.log(this.applicantInfoList);
          this.divApplicationInfo = true;
          this.divError = false;
         //this.renderer.setProperty(this.txtCountryCode.nativeElement, 'value', this.applicantInfoList[0].CountryCode);
          this.countryCode =this.applicantInfoList[0].CountryCode;
         // this.renderer.setProperty(this.txtYear.nativeElement, 'value', this.applicantInfoList[0].Year);
          this.year = this.applicantInfoList[0].Year;         
          //this.renderer.setProperty(this.txtMonth.nativeElement, 'value', this.applicantInfoList[0].Month);
          this.month = this.applicantInfoList[0].Month;
         // this.renderer.setProperty(this.txtIOACode.nativeElement, 'value', this.applicantInfoList[0].IOACode);
          this.ioaCode = this.applicantInfoList[0].IOACode;
          //this.renderer.setProperty(this.txtRunningNo.nativeElement, 'value', this.applicantInfoList[0].RNo);
          this.rNo = this.applicantInfoList[0].RNo;
          //this.renderer.setProperty(this.txtNRICNo.nativeElement, 'value', this.applicantInfoList[0].IDNumber);
          this.nricNo = this.applicantInfoList[0].IDNumber;
          //this.renderer.setProperty(this.txtPassportNo.nativeElement, 'value', this.applicantInfoList[0].PassportNo);
          this.passportNo = this.applicantInfoList[0].PassportNo;
          //this.renderer.setProperty(this.txtName.nativeElement, 'value', this.applicantInfoList[0].FullName);
          this.applicantName = this.applicantInfoList[0].FullName;
        }
      }
    },
    error =>{
      this.error = "Record Not found";
      this.divError = true;
      this.divApplicationInfo = false;
      // var dialogRef =this.dialog.open(ModalPopupComponent,{ data: {
      //   message : "Record Not found",
      //   title : "Alert!",
      //   buttonText : "Cancel"
      // }});
      // dialogRef.afterClosed().subscribe(result => {
      //   //console.log('The dialog was closed',result);
      //   this.returnUrl = result;
      //   result ? this.router.navigate(['/agency-details']): this.router.navigate(['/biometric',{applicationId:this.visaRefNo}]);
      // });
    });

  }

  onFaceClick(){
    this.divApplicationInfo =false;
    this.divFaceCapturing =true;  
    this.divFingerCapturing = false;  
    this.startCamera();
   // this.webCamSetting();
   //this.attachVideo(this);
  }

  webCamSetting(){
   
    Webcam.set({
      width: 140,// 132,
      height: 190,// 189,
      image_format: 'jpeg',
      jpeg_quality: 100,
      alert:'a'
    });
    var c = this.CameraElement.nativeElement;
    Webcam.attach(c);
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
        alert('Sorry, camera not available.');
    }
  }

  attachVideo(stream) {
    //console.log(stream);
    this.localstream = stream;
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
        this.videoHeight = 190;// 189;//this.videoElement.nativeElement.videoHeight;
        this.videoWidth = 140;// 132;//this.videoElement.nativeElement.videoWidth;
        //alert("Width :"+this.videoWidth +" "+"Height: "+this.videoHeight);
    });
    // Webcam.set({
    //   width: 132,
    //   height: 189,
    //   image_format: 'jpeg',
    //   jpeg_quality: 100,
    //   alert:'a'
    // });
    // var c = this.CameraElement.nativeElement;
    // Webcam.attach(c);
   
  }

  handleError(error) {
    console.log('Error: ', error);
    alert(error);
  }

  capture() {
  // this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoElement.nativeElement.videoWidth);
  // this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoElement.nativeElement.videoHeight);
   //  this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0,140,190);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 180, 80, 264, 378, 0, 20, 132, 189);
    // this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 90, 40, 140, 190, 0, 0, 140, 190);
    //this.canvas.nativeElement.getContext('2d').fillRect(this.videoElement.nativeElement, 25, 25, 100, 100);
    this.picture = this.canvas.nativeElement.toDataURL("image/Jpeg");
    
    this.videoElement.nativeElement.pause();
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
    //var base64 = this.picture.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    //console.log(base64);
    //console.log(this.picture);
    if(this.visaRefNo == ""){
      this.visaRefNo = this.applicantInfoForm.controls['visaRefNo'].value;
    }
    this.saveSuccess = "N";
    this.capturePhotoSuccess = "Y";
    this.FaceCaptureSuccessMessage = "Photo Captured Success,Please click Save & Continue";
    this.divSuccess = true;
    this.divFaceCaptureError = false;
    // this.dataService.saveDocuments(this.visaRefNo,'Face Capture','png',base64).subscribe((data:any)=>{
    //   this.divSuccess = true;
    //   this.divApplicationInfo = false;
    //   this.saveSuccess = "Y";
    //   //this.divFaceCapturing = false;
    //   // this.divFingerCapturing = true;
    // },
    // error =>{
    //   this.error=error.error.Message;
    //   this.divError = true;
    //   this.saveSuccess = "N";
    // });
    
     //this.divSuccess = true;
     //this.divFaceCapturing = false;
    //  this.divFingerCapturing = true;
  }

  saveFingerCapture(){
    if(this.capturePhotoSuccess == "Y"){
      var base64 = this.picture.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
      this.dataService.saveDocuments(this.visaRefNo,'Face Capture','png',base64).subscribe((data:any)=>{
        this.FaceCaptureSuccessMessage = "Face Captured Success";
        this.divSuccess = true;
        this.divApplicationInfo = false;
        this.saveSuccess = "Y";
        if(this.saveSuccess == "Y"){
          this.divFaceCapturing = false;
          this.divFingerCapturing = true;
        }
      //this.divFaceCapturing = false;
      // this.divFingerCapturing = true;
      },
      error =>{
        this.FaceCaptureErrorMessage = error.error.Message;
        this.divFaceCaptureError = true;
        this.saveSuccess = "N";
        if(this.saveSuccess == "N" ){
          return;
        }
      });

      // if(this.saveSuccess == "Y"){
      //   this.divFaceCapturing = false;
      //   this.divFingerCapturing = true;
      // }
      // else if(this.saveSuccess == "N" ){
      //   return;
      // }
    }
    else{
      this.FaceCaptureErrorMessage = "Please click Take Photo to capture ";
      this.divFaceCaptureError = true;
    }
    
   
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
    //   this.FingerErrorMessage = error.error.Message;
      
    //   this.divFingerError = true;
    // });
    this.FingerSuccessMessage = "Fingers Captured Successfully";
    this.divFingerSuccess = true;
    this.divFingerCapturing = false;
    this.divDocuments = true;
  }

  saveDocuments(){//alert("1");
    this.isSubmitted = true;
    if(this.UploadPassportForm.invalid){
      //this.divApplicationInfo =false;
      return;
    }
    else if(this.UploadNRICForm.invalid){
      return;
    }
    else if(this.UploadFlightForm.invalid){
      return;
    }
    else if(this.UploadFundForm.invalid){
      return;
    }
    else if(this.UploadYellowFeverForm.invalid){
      return;
    }
    else if(this.UploadCovid19Form.invalid){
      return;
    }

    //alert("2");
    // const formData = new FormData();
    // formData.append('file', this.myForm.get('fileSource').value);
    //this.DocumentErrorMessage =  " error";
    //this.divDocumentError = true;
    return;
  }

  submit(){
    // const formData = new FormData();
    // formData.append('file', this.myForm.get('fileSource').value);

    // this.dataService.saveDocuments(this.visaRefNo,'Passport','png',formData).subscribe((data:any)=>{
     
    //   //this.divFingerSuccess = true;
    // },
    // error=>{
    //   this.error=error.error.Message;
      
    //   //this.divFingerError = true;
    // });
   
    
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
      this.divFaceCaptureError = true;
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

  // webCamSetting(){
  //   Webcam.set({
  //     width: 220,
  //     height: 190,
  //     image_format: 'jpeg',
  //     jpeg_quality: 100
  //   });
  //   Webcam.attach(this.CameraElement.nativeElement);
  // }

  takeSnapShot(){
    Webcam.snap(function (data_uri) {
      //this.downloadImage('ashiq',data_uri);
      //this.ImageSave();
     // alert(data_uri);
      var a = document.createElement('a');
      a.setAttribute('download', 'ashiq' + '.png');
      a.setAttribute('href', data_uri);
      a.click();
      
      // this.dataService.saveDocuments(this.visaRefNo,'Face Capture','png',base64).subscribe((data:any)=>{
      //   this.divSuccess = true;
      // },
      // error =>{
      //   this.error=error.error.Message;
      //   this.divError = true;
      // });
   });
  
  }

  ImageSave(){

  }

  downloadImage(name, datauri){
    var a = document.createElement('a');
    a.setAttribute('download', name + '.png');
    a.setAttribute('href', datauri);
    a.click();
  }

  ScanPasport(){
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');
    //var img = document.createElement('img');
    img.src = 'assets/images/Passport.jpg';//'https://media.geeksforgeeks.org/wp-content/uploads/20190529122828/bs21.png';//'assetsimages/L0.jpg';
    //document.getElementById(this.displayScanDoc.nativeElement).appendChild(img);
    this.renderer.removeChild(this.displayScanDoc.nativeElement, img);
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
    //this.displayScanDocuments = img;//"<img  src='assets\images\L0.jpg' >"

  }

  ScanNRIC(){    
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');    
    img.src = 'assets/images/AdharCard_02.jpg';
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
  }

  ScanTicket(){    
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');    
    img.src = 'assets/images/Ticket.jpg';
    //img.width ='100%';
    this.renderer.setStyle(img, 'width', `100%`);
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
  }

  ScanSponsorLetter(){    
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');    
    img.src = 'assets/images/Sponsor Letter.jpg';
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
  }

  ScanSufficientFund(){    
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');    
    img.src = 'assets/images/DebitCard.jpg';
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
  }

  ScanYellowFever(){    
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');    
    img.src = 'assets/images/YellowFever.jpg';
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
  }

  ScanCovid19(){    
    const childElements = this.displayScanDoc.nativeElement.childNodes;
    for (let child of childElements) {
      this.renderer.removeChild(this.displayScanDoc.nativeElement, child);
    }
    const img = this.renderer.createElement('img');    
    img.src = 'assets/images/Covid19.jpg';
    this.renderer.appendChild(this.displayScanDoc.nativeElement, img);
  }

  

  

}
