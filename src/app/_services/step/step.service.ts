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

export class StepService {
    baseUrl = environment.baseUrl;
    jwtHelperService = new JwtHelperService();
    decodedToken: any;
    
    constructor(private http: HttpClient) { }

    getSteps(requestForm: RequestModel): Observable<ResponseModel> 
    {
        return this.http.post<ResponseModel>(this.baseUrl + 'step',requestForm);
    }

    getStepsOfArticle(articleId: any): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'step/GetStepsOfArticle?articleId='+articleId);
    }

    getStep(id): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(this.baseUrl + 'step/getStep/' + id);
    }

    addStep(model: any) {
        return this.http.post(this.baseUrl + 'step/add', model);
    }

    editSteps(model: any) {
        return this.http.post(this.baseUrl + 'step/edit', model);
    }

    editStep(model: any,id : number) {
        return this.http.post(this.baseUrl + 'step/editSingle?id='+id, model);
    }

    addHighlight(model: any) {
        return this.http.post(this.baseUrl + 'highlight/add', model);
    }

    addBookmark(model: any) {
        return this.http.post(this.baseUrl + 'bookmark/add', model);
    }
}
