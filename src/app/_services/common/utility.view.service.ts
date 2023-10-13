import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt/src/jwthelper.service";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Article } from "src/app/_models/article";
import { Step } from "src/app/_models/step";
import { AuthLoginService } from "../auth.service";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token"),
  }),
};

@Injectable({
  providedIn: "root",
})
export class UtilityViewService {
  private _listners = new Subject<any>();

  constructor(private authService: AuthLoginService) {}

  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  isSameUser(user: number): boolean {
    let currentUser = JSON.parse(localStorage.getItem("nameid"));
    //alert(user);
    return currentUser == user;
  }

  isAdminUser(): boolean {
    let isRoleAdmin = this.authService.isRoleMatch("Admin");
    return isRoleAdmin;
  }

  isLoggedIn(): boolean {
    return this.authService.loggedIn();
  }
}
