import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  codeForm: FormGroup;
  code: any;
  constructor(private fb: FormBuilder, private userService: UserService, private alertify: AlertifyService, private router: Router,private routeParams:ActivatedRoute) {
    this.routeParams.queryParams.subscribe(params => {
      this.code = params["resetEncryptionCode"];
    });

   }

  ngOnInit() {
    this.codeForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword:['',Validators.required]
    });
  }

  OnSubmit(){
    this.codeForm.value.code = this.code;
    this.codeForm.value.newPassword = this.codeForm.controls['confirmPassword'].value;
    this.userService.recoverPassword(this.codeForm.value).subscribe(() => {
      this.alertify.success('Password reset successfull, Please login with new password!');
      this.router.navigate(['/login']);
    }, error => {
      this.alertify.error(error.message);
    });
  }
}
