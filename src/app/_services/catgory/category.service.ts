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

export class CategoryService {
    baseUrl = environment.baseUrl;
    jwtHelperService = new JwtHelperService();
    decodedToken: any;
    
    constructor(private http: HttpClient) { }

    getSubCategories(): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'subCategory/GetSubCategories');
    }

    getSubCategory(id: number): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'subCategory/GetSubCategory?id='+id);
    }

    
    getSubCategoryByCategory(id: number): Observable<ResponseModel> 
    {
        return this.http.get<ResponseModel>(this.baseUrl + 'subCategory/GetSubCategoriesByCategory?id='+id);
    }

    getCategories(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(this.baseUrl + 'category/GetCategories');
    }

    getTopCategories(count: number): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(this.baseUrl + 'category/GetPopularCategories?count='+count);
    }

    getTopSubCategories(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(this.baseUrl + 'subcategory/GetTopSubCategories');
    }

    getCategoriesForNavigation(): Observable<ResponseModel> {
        return this.http.get<ResponseModel>(this.baseUrl + 'category/GetCategoriesForNavigation');
    }

    getCategoryByName(name:string): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'category/getCategoryByName/'+name);
    }

    
    getSubCategoryByName(name:string): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'subcategory/getSubCategoryByName?name='+name);
    }

    editCategory(model: any,id: number): Observable<any> {
        return this.http.post(this.baseUrl + 'category/edit?id='+id, model, httpOptions);
    }

    addCategory(model: any): Observable<any> {
        return this.http.post(this.baseUrl + 'category/add', model, httpOptions);
    }

    editSubCategory(model: any,id: number): Observable<any> {
        return this.http.post(this.baseUrl + 'subcategory/edit?id='+id, model, httpOptions);
    }

    addSubCategory(model: any): Observable<any> {
        return this.http.post(this.baseUrl + 'subcategory/add', model, httpOptions);
    }
}
