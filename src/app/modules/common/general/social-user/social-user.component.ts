import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup,  Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SocialAuthService } from "angularx-social-login";
import { LoginModel } from "src/app/models/login.model";
import { User } from "src/app/_models/user";
import { AlertifyService } from "src/app/_services/alertify.service";
import { AuthLoginService } from "src/app/_services/auth.service";
import { SignalRService } from "src/app/_services/notification/signalR.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-social-user",
  templateUrl: "./social-user.component.html",
  styleUrls: ["./social-user.component.css"],
})
export class SocialUserComponent implements OnInit {
  userAddForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
    password: [
      "",
      [
        Validators.required,
        Validators.pattern(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
        ),
      ],
    ],
    firstname: [""],
    lastname: [""],
    email: [""],
    job: [""],
    image: [""],
    idToken: [""],
    token: [""],
    userLanguages: [""],
  });
  model: LoginModel;
  userData: any[] = [];
  resultMessage: string;
  requestedUser: User;
  modelInfo: any;
  constructor(
    private authService: AuthLoginService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.modelInfo = JSON.parse(localStorage.getItem("RegisterInfo"));
    this.setValues();
    if (this.authService.loggedIn()) {
      this.router.navigate(["/userhome"]);
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

  userAdd(userAddForm) {
    this.authService.register(userAddForm.value).subscribe(
      () => {
        this.alertify.success("registration success!");
      },
      (error) => {
        this.alertify.error(error.message);
      },
      () => {
        this.router.navigate(["/login"]);
      }
    );
  }

  setValues() {
    this.userAddForm.controls["firstname"].setValue(this.modelInfo.firstname);
    this.userAddForm.controls["email"].setValue(this.modelInfo.email);
    this.userAddForm.controls["lastname"].setValue(this.modelInfo.lastname);
    this.userAddForm.controls["image"].setValue(this.modelInfo.image);
    this.userAddForm.controls["job"].setValue(this.modelInfo.job);
    this.userAddForm.controls["idToken"].setValue(this.modelInfo.idToken);
    this.userAddForm.controls["token"].setValue(this.modelInfo.token);
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
}
