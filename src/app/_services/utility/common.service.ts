import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    baseUrl = environment.baseUrl;
    jwtHelperService = new JwtHelperService();
    decodedToken: any;
    
    constructor(private http: HttpClient) { }
    
    GetEnums(enumType: any): Observable<any> {
        return this.http.get(this.baseUrl + 'enum/GetEnum?enumNumber='+enumType);
    }

    GetLanguageString(language : number) : string{
        switch(language){
          case 1:
            return 'en-US'
          case 2:
            return 'si-LK'
          case 3:
            return 'ta-LK'
          case 4:
            return 'hi-IN'
          case 5:
            return 'ru-RS'
          case 6:
            return 'ch-CH'
        }
    }
}
