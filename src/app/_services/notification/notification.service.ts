import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseModel } from 'src/app/request/response-model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequestModel } from 'src/app/request/requestModel';

const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}

@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    baseUrl = environment.baseUrl;
    jwtHelperService = new JwtHelperService();
    decodedToken: any;
    
    constructor(private http: HttpClient) { }

    getNotification(): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'notification/getNotifications?clientDate='+ new Date().toISOString(),httpOptions);
    }

    getNotificationList(requestForm: RequestModel): Observable<ResponseModel> 
    { 
        return this.http.post<ResponseModel>(this.baseUrl + 'notification/getNotificationList',requestForm);
    }
    
    getNotificationsLite(): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'notification/getNotificationsLite',httpOptions);
    }

    readNotification(notificatioId: any): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'notification/ReadNotification?notificationId='+notificatioId,httpOptions);
    }

    readNotifications(): Observable<any> 
    {
        return this.http.get<any>(this.baseUrl + 'notification/ReadNotifications');
    }

}