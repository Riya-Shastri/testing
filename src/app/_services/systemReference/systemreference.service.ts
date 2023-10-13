import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ResponseModel } from "src/app/request/response-model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { RequestModel } from "src/app/request/requestModel";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token"),
  }),
};

@Injectable({
  providedIn: "root",
})
export class systemReferenceService {
  baseUrl = environment.baseUrl;
  jwtHelperService = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  getSystemReferences(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "admin/getSystemReferences"
    );
  }
}
