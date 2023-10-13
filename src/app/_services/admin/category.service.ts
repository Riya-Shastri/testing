import { ResponseModel } from 'src/app/request/response-model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestModel } from 'src/app/request/requestModel';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class CategoryService{
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient){

    }

    getSubcategories(){
        return this.http.get(this.baseUrl+ 'subcategory/usersWithRoles');
    }
    
}