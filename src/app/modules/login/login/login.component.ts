import { Component, OnInit } from "@angular/core";
import { AuthLoginService } from "../../../_services/auth.service";
import { AlertifyService } from "../../../_services/alertify.service";
import { LoginModel, SocialLoginModel } from "../../../models/login.model";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../../_services/user.service";
import { UserHomeComponent } from "../../user/user-home/user-home.component";
import { User } from "../../../_models/user";
import { ResponseModel } from "../../../request/response-model";
import { SignalRService } from "src/app/_services/notification/signalR.service";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from "angularx-social-login";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  model: LoginModel;
  loginForm: FormGroup;
  userData: any[] = [];
  resultMessage: string;
  requestedUser: User;
  socialModel: SocialLoginModel;
  private subscription: Subscription;
  constructor(
    private authService: AuthLoginService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private signalRService: SignalRService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(["/userhome"]);
    }

    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  loginWithCaptcha(): void {
    this.subscription = this.recaptchaV3Service
      .execute("OnSubmit")
      .subscribe((token) => console.log(token));
  }

  login() {
    this.authService.login(this.model).subscribe(
      () => {
        this.alertify.success("login success!");
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }
  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem("token");
    this.alertify.message("logged out");
    this.signalRService.stopHubConnection();
  }

  OnSubmit(loginForm) {
    this.authService.login(loginForm.value).subscribe(
      () => {
        this.alertify.success("login success!");
      },
      (error) => {
        this.alertify.error(error.message);
      },
      () => {
        this.router.navigate(["/userhome"]);
      }
    );
  }

  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then((userData) => {
      const socialModel: any = {
        token: userData.authToken,
        firstname: userData.name.split(" ")[0],
        lastname: userData.name.split(" ")[1],
        provider: userData.provider,
        name: userData.name,
        email: userData.email,
        password: this.generatePassword(),
        job: "",
        image: userData.photoUrl,
        idToken: userData.idToken,
      };
      this.customLogin(socialModel);
    });
  }

  customLogin(model) {
    this.authService.login(model).subscribe(
      (response: any) => {
        if (response == false) {
          this.router.navigate(["/userhome"]);
          this.alertify.success("login success!");
        }
      },
      (error) => {
        this.alertify.error(error.message);
      },
      () => {}
    );
  }

  isAuthenticated(token) {
    this.authService.tokenExpired(token);
  }

  generatePassword(): string {
    const length = 12;
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }

    return password;
  }
}
