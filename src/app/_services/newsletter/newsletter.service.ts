import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}

@Injectable({
    providedIn: 'root'
})

export class NewsletterService{
    constructor(private http: HttpClient) { }
    baseUrl = environment.baseUrl;
    saveNewsletter(email:any): Observable<any> 
    {
        return this.http.post<any>(this.baseUrl + 'newsletter/addNewsletterItem?email='+ email,null);
    }

}