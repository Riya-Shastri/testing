import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthLoginService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RequestModel } from 'src/app/request/requestModel';
import { Observable } from 'rxjs';
import { ResponseModel } from 'src/app/request/response-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}

@Injectable({
    providedIn: 'root'
})

export class UploadService{
    baseUrl = environment.baseUrl;
    jwtHelperService = new JwtHelperService();
    decodedToken: any;
    
    constructor(private http: HttpClient) { }

    uploadFile(requestForm: any): Observable<ResponseModel> 
    { 
        return this.http.post<ResponseModel>(this.baseUrl + 'Images/UploadImageCropped',requestForm);
    }
}