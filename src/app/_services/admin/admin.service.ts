import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResponseModel } from 'src/app/request/response-model';
import { Observable } from 'rxjs';
import { Article } from 'src/app/_models/article';
import { Injectable } from '@angular/core';
import { RequestModel } from 'src/app/request/requestModel';
import { User } from 'src/app/_models/user';

@Injectable({
    providedIn: 'root'
})

export class AdminService{
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient){

    }

    getUsersWithRoles(){
        return this.http.get(this.baseUrl+ 'admin/usersWithRoles');
    }

    SearchUsers(requestForm: RequestModel): Observable<ResponseModel> {
        return this.http.post<ResponseModel>(this.baseUrl + 'user/searchUsers',requestForm);
    }

    editRoles(user:User, roles: {}){
        return this.http.post(this.baseUrl + 'admin/editRoles/'+user.userName, roles);
    }

}