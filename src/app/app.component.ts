import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthLoginService } from "./_services/auth.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { SignalRService } from "./_services/notification/signalR.service";
import { HttpClient } from "@angular/common/http";
import { User } from "./_models/user";
import { ScriptService } from "./_services/common/script.service";
import { NotificationService } from "./_services/notification/notification.service";
import { NotificationViewService } from "./_services/notification/notification-view.service";
import { Observable } from "rxjs/internal/Observable";
import { interval } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
declare let $: any;
declare const Waypoint: any;
declare let gtag: Function;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  jwtHelper = new JwtHelperService();
  isHideHeader: boolean;
  public currentUser: number;
  title = "ClientApp";
  users: any;
  notifications: any[];
  constructor(
    private scriptService: ScriptService,
    private authService: AuthLoginService,
    public signalRService: SignalRService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private notificationViewService: NotificationViewService,
    private router: Router
  ) {
    //this.scriptService.loadScripts('jQuery','popper','bootstrap');
    this.scriptService.loadStyles("googleFonts");
  }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    this.getCurrentUserIPAddress();
    this.setUpAnalytics();
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
      //this.signalRService.createHubConnection(token);
      //this.signalRService.createHubConnection(token);
    }
    // this.signalRService.startConnection(token);
    // setTimeout(()=>{
    //   // this.signalRService.askServerListener();
    //   // var connectionStarted = "connection started";
    //   // this.signalRService.askServer(connectionStarted);

    // },30000);
    if (location.href.indexOf("thilanka.ranasinghe") >= 0) {
      this.isHideHeader = true;
    } else {
      this.isHideHeader = false;
    }
  }

  setUpAnalytics() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag("config", "G-FXRKME4F89", {
          page_path: event.urlAfterRedirects,
        });
      });
  }

  setUpCaptcha() {
    // <script src="https://www.google.com/recaptcha/api.js"></script>
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag("src", "https://www.google.com/recaptcha/api.js", {
          page_path: event.urlAfterRedirects,
        });
      });
  }

  ngOnDestroy() {
    //this.signalRService.hubConnection.off("broadCastNotification");
    //this.signalRService.stopHubConnection();
  }

  getUserToken(): number {
    var token;
    localStorage.setItem("token", token);
    if (token) {
      this.currentUser = this.jwtHelper.decodeToken(token).nameid;
    }
    return this.currentUser;
  }

  getCurrentUserIPAddress() {
    if (localStorage.getItem("LocationInfo") === null) {
      this.http.get("https://httpbin.org/ip").subscribe((response: any) => {
        localStorage.setItem("IP", response.origin);
        this.authService
          .getLocationInfoFromIP(response.origin)
          .subscribe((response: any) => {
            localStorage.setItem(
              "LocationInfo",
              JSON.stringify(response.responseBody.content)
            );
          });
      });
    }
  }
}
