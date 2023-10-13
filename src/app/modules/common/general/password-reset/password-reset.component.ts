import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  isSentEmail: boolean = false;
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService, private alertify: AlertifyService, private router: Router) { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      confirmEmail: ['', Validators.required],
      Code: ['']
    });
  }
  
  OnSubmit(loginForm){
    this.userService.sendResetEmail(loginForm.controls['email'].value).subscribe(() => {
      this.alertify.success('Code sent to your email, please check and enter here!');
      let navigationExtras: NavigationExtras = {
        queryParams: {
            "email": loginForm.controls['email'].value
        }
      };
      this.router.navigate(['/enter-resetcode'],navigationExtras);
    }, error => {
      this.alertify.error(error.message);
    });
  }

}
