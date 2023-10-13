import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import {
  DeviceInfo,
  LoginModel,
  SocialLoginModel,
} from "../models/login.model";
import { Router } from "@angular/router";
import { CartViewService } from "./cart/cart-view.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../request/response-model";
import { CommonService } from "./utility/common.service";
import { parse } from "ts-node";
import { SignalRService } from "./notification/signalR.service";
import { NavService } from "./nav/nav.service";
import { IpServiceService } from "./common/ip-service.service";

@Injectable({
  providedIn: "root",
})
export class AuthLoginService {
  baseUrl = environment.baseUrl + "auth/";
  jwtHelperService = new JwtHelperService();
  public decodedToken: any;
  socialModel: SocialLoginModel;
  constructor(
    private http: HttpClient,
    private router: Router,
    private cartViewService: CartViewService,
    private commonService: CommonService,
    private signalRService: SignalRService,
    private ipService: IpServiceService
  ) {}

  login(model: any) {
    let deviceInfo = {} as DeviceInfo;
    deviceInfo.iPAddress = this.ipService.getIPAddress();
    model.device = deviceInfo;
    return this.http.post(this.baseUrl + "login", model).pipe(
      map((response: any) => {
        console.log("Response:", response);
        if (response) {
          const user = response.user;
          if (response.token != "") {
            if (user) {
              localStorage.setItem("token", response.token);
              this.decodedToken = this.jwtHelperService.decodeToken(
                response.token
              );
              sessionStorage.setItem("id", this.decodedToken.nameid);
              localStorage.setItem("nameid", this.decodedToken.nameid);
              localStorage.setItem("documentId", user.documentId);
              localStorage.setItem("userName", user.userName);
              localStorage.setItem("userImage", this.decodedToken.given_name);
              localStorage.setItem("fullName", user.firstName);
              localStorage.setItem("isFirstTimeLogin", user.isFirstTimeLogin);
              localStorage.setItem("Languages", user.Languages);
              localStorage.setItem(
                "preferredLanguage",
                this.commonService.GetLanguageString(
                  parseInt(user.preferredLanguage)
                )
              ),
                localStorage.setItem(
                  "UserLanguages",
                  user.userLanguages
                    .map((language: { languageId: any }) => language.languageId)
                    .join(", ")
                );
              localStorage.setItem("userData", response.cart.id);
              localStorage.setItem(
                "cartCount",
                response.cart.cartItems == null
                  ? 0
                  : response.cart.cartItems.length
              );
              //this.signalRService.createHubConnection(response.token);
            }
            this.router.navigate(["/userhome"]);
          } else if (model.token != null) {
            localStorage.setItem("RegisterInfo", JSON.stringify(model));
            this.router.navigate(["/userinfo"]);
          }

          this.emitCartInfo();
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "register", model);
  }

  loggedIn() {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    return !this.jwtHelperService.isTokenExpired(token) && token != null;
  }
  emitCartInfo(): void {
    this.cartViewService.updateCount(true);
  }
  logout() {
    const token = localStorage.getItem("token");
  }

  tokenExpired(token: string) {
    return this.jwtHelperService.isTokenExpired(token);
  }

  isRoleMatch(allowedRoles: string | any[]): boolean {
    this.decodedToken = this.jwtHelperService.decodeToken(
      localStorage.getItem("token")
    );
    if (!this.decodedToken) {
      return false;
    }
    let isMatch = false;
    const userRoles = Array.isArray(this.decodedToken.role)
      ? (this.decodedToken.role as Array<string>)
      : this.decodedToken.role;
    if (userRoles && Array.isArray(userRoles)) {
      if (Array.isArray(allowedRoles)) {
        allowedRoles.forEach((element) => {
          if (userRoles.includes(element.toString())) {
            isMatch = true;
            return true;
          }
        });
      } else {
        if (userRoles.includes(allowedRoles)) {
          isMatch = true;
          return true;
        }
      }
    } else if (userRoles && userRoles == allowedRoles) {
      isMatch = true;
      return isMatch;
    }
    return isMatch;
  }

  isRoleAdmin(token: string): boolean {
    if (!token) {
      return false;
    }
    let isMatch = false;
    let allowedRoles = this.jwtHelperService.decodeToken(token);
    const userRoles = Array.isArray(allowedRoles)
      ? (allowedRoles as Array<string>)
      : allowedRoles;
    if (userRoles && Array.isArray(userRoles)) {
      userRoles.forEach((element) => {
        if (userRoles && userRoles.includes(element)) {
          isMatch = true;
          return;
        }
      });
    } else if (userRoles && userRoles == "Admin") {
      isMatch = true;
      return;
    }
    return isMatch;
  }

  getNavbarTitles(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl +
        "GetLocalizedNavBar/?culture=" +
        localStorage.getItem("preferredLanguage")
    );
  }

  updateFirstTimeLogin(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "user/updateFirstTimeLogin/" + this.decodedToken.nameid
    );
  }

  getLocationInfoFromIP(ip: string): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "GetLocationInfoFromIP?ipAddress=" + ip
    );
  }
}
