import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseModel } from 'src/app/request/response-model';
import { Observable } from 'rxjs';
import { Article } from 'src/app/_models/article';
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

export class EnumService {
    baseUrl = environment.baseUrl;
    jwtHelperService = new JwtHelperService();
    decodedToken: any;
    
    constructor(private http: HttpClient) { }

    getEnumList(type : number): Observable<ResponseModel> 
    {
        // EnumTypes = 0,
        // CurrencyCodes = 1,
        // Languages = 2,
        // TableTypes = 3,
        // Countries = 4,
        // UserType = 5
        return this.http.get<ResponseModel>(this.baseUrl + 'enum/GetEnum?enumNumber='+ type);
    }

  
}
