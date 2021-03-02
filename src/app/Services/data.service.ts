import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders ,HttpErrorResponse,HttpRequest,HttpParams,HttpEvent } from '@angular/common/http';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { retry, catchError,map,flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiData = new BehaviorSubject<any>(null);
  public apiData$ = this.apiData.asObservable();

  private API_TEST_SERVER  = "http://1.9.116.25/ARB-Service";//"http://192.168.0.10/ARB-Service";
  private API_TEST_SERVER1 = "https://localhost:44372";

  constructor(private httpClient: HttpClient) { }
  public errorMessage: string = '';
  public staffId = 0 ;
  public visaRefNo = '';

  handleError(error: HttpErrorResponse) {
    //console.log(error+"Err");
    let errorMessage = 'Unknown error!';
    if(error.status===401||error.status===403){
      errorMessage=error.message;
    }
    else if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getContact():Observable<any>{
    var accessToken=  localStorage.getItem('auth-token');
     var httpOptions = {
       headers: new HttpHeaders().set('Authorization', `Bearer ${accessToken}` )
     }
     return this.httpClient
     .get(this.API_TEST_SERVER+ '/api/UserStaffProfile',httpOptions)
     .pipe(map(response => response));
 
  }

  public getDashboardCountById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/DashboardCountById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  } 

  public getDashboardCurrentCountById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/DashboardCurrentCountById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  } 

  public getDashboardPendingCountById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/DashboardPendingCountById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  } 

  public getDashboardApprovedCountById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/DashboardApprovedCountById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }
  
  public getDashboardRecentApplicationsById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/DashboardRecentApplicationsById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  public getRecentApplicationsById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/RecentApplicationsById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }
  
  public getApplicantStatusByVisaRefNo(visaRefNo ):Observable<any>{
    var params=new HttpParams();
    params=params.append('visaRefNo',visaRefNo);
    return this.httpClient.get(this.API_TEST_SERVER+ '/api/ApplicantByVisaRefNo', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  public getApplicantPreviewByVisaRefNo(visaRefNo ):Observable<any>{
    var params=new HttpParams();
    params=params.append('VisaRefNo',visaRefNo);
    return this.httpClient.get(this.API_TEST_SERVER+ '/api/ApplicantPreviewByVisaRefNo', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  saveDocuments(visaRefNo,docName,docExt,docFile):Observable<any>{
   var httpOptions = {
     headers: new HttpHeaders({'Content-Type': 'application/json'})
   }

   return this.httpClient.post(this.API_TEST_SERVER + '/api/Documents',
     {
       "MyEVisaRefNo":visaRefNo,
       "DocName":docName,
       "DocExt":docExt,
       "DocFile":docFile
     } ,httpOptions)
     .pipe(
       map(res => res),
       catchError((error: HttpErrorResponse) => {
         return throwError(error);
       }));

 }

 getDocumentsByVisaRefNo(visaRefNo):Observable<any>{
    var params=new HttpParams();
    params=params.append('VisaRefNo',visaRefNo);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/DocumentsByVisaRefNo', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  
  }

 downloadDataAsBase64(url: string): Observable<string> {alert(url);
    return this.httpClient.get(url, { responseType: 'blob' }).pipe(
      flatMap(blob => {
        return this.blobToBase64(blob);
      })
    );
  }

  blobToBase64(blob: Blob): Observable<any> {
    const fileReader = new FileReader();
    const observable = new Observable(observer => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
    fileReader.readAsDataURL(blob);
    return observable;
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.API_TEST_SERVER}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }

  public getBioMetricListById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/biometricListByStaffId', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  public getOrdinaryApplicationsById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/OrdinaryApplicationsById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  public getRushApplicationsById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/RushApplicationsById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  public getExtraRushApplicationsById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/ExtraRushApplicationsById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }

  public getPendingApplicationsById(id){
    var params=new HttpParams();
    params=params.append('id',id);

    return this.httpClient.get(this.API_TEST_SERVER+ '/api/PendingApplicationsById', {params: params}).pipe(map(response => response),catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }));
  }


}
