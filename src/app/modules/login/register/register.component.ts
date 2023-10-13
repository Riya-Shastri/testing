import { Component, OnInit } from '@angular/core';
import { AuthLoginService } from '../../../_services/auth.service';
import { AlertifyService } from '../../../_services/alertify.service';
import {  FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  registerForm:  FormGroup;
  constructor(private authService: AuthLoginService, private alertify: AlertifyService,private fb: FormBuilder,
     private router: Router,private socialAuthService: SocialAuthService) { }

  ngOnInit() {
    if(this.authService.loggedIn()){
      this.router.navigate(['/userhome'])
    }

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      job: ['', Validators.required]
    });
  }

  OnSubmit(registerForm){
    this.authService.register(registerForm.value).subscribe(() => {
      this.alertify.success('registration success!');
    }, error => {
      this.alertify.error(error.message);
    }, ()=> {
      this.router.navigate(['/login']);
    });
  }

  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      const socialModel: any = {
        "token" : userData.authToken,
        "firstname" : userData.name.split(' ')[0],
        "lastname" : userData.name.split(' ')[1],
        "provider" : userData.provider,
        "name" : userData.name,
        "email" : userData.email,
        "password" : userData.email + userData.name,
        "job" : "",
        "image" : userData.photoUrl,
        "idToken" : userData.idToken
      };
      this.customLogin(socialModel);
    });
  }

  customLogin(model){
    this.authService.login(model).subscribe((response: any) => {
      model.token="";
      if(response == false){
        this.router.navigate(['/userhome']);
        this.alertify.success('login success!');
      }
    }, error => {
      this.alertify.error(error.message);
    }, () => {
    });
  }

}
