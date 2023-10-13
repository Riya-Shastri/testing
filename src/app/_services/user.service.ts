import { Injectable } from "@angular/core";
import { HttpClient, HttpHandler, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import { User } from "../_models/user";
import { Observable } from "rxjs";
import { ResponseModel } from "../request/response-model";
import { RequestModel } from "../request/requestModel";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token"),
  }),
};

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl = environment.baseUrl;
  jwtHelperService = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.baseUrl + "user");
  }

  // getFollowers(): Observable<ResponseModel> {
  //   return this.http.get<ResponseModel>(this.baseUrl + 'user');
  // }
  getFollowings(requestForm: RequestModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/searchFollowings",
      requestForm
    );
  }

  getUser(id: any): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "user/GetUserById?id=" + id
    );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(
      this.baseUrl + "users/GetUserByEmail?email=" + email
    );
  }

  getUserByName(name: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "user/GetUserByName?name=" + name
    );
  }

  addFollower(follower: any) {
    return this.http.post(this.baseUrl + "user/addFollower", follower);
  }

  removeFollower(follower: any) {
    return this.http.post(this.baseUrl + "user/removeFollower", follower);
  }

  sendResetEmail(email: any) {
    return this.http.get(
      this.baseUrl + "auth/PasswordResetSendCode?email=" + email
    );
  }

  getRecoveryRight(requestForm: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/RecieveCode",
      requestForm
    );
  }

  recoverPassword(requestForm: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "auth/RecoverPassword",
      requestForm
    );
  }

  uploadProfileImage(requestForm: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/UploadProfileImage",
      requestForm
    );
  }

  uploadCoverImage(requestForm: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/UploadCoverImage",
      requestForm
    );
  }

  editUser(requestForm: any, userId: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/edit?userId=" + userId,
      requestForm
    );
  }

  checkUserInfo(userInfo: string) {
    return this.http.get(
      this.baseUrl + "user/CheckUserInfo?userInfo=" + userInfo
    );
  }

  getReadHistory(articleType: string | number): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "article/GetReadingHistory?articleType=" + articleType
    );
  }

  addSubCategories(requestForm: any): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/MapToSubCategories",
      requestForm
    );
  }

  updateFirstTimeLogin(): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "user/UpdateFirstTimeLogin",
      null
    );
  }
}
