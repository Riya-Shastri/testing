import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ResetCodeRequest } from 'src/app/_requestModels/resetCodeRequest';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-enter-resetcode',
  templateUrl: './enter-resetcode.component.html',
  styleUrls: ['./enter-resetcode.component.css']
})
export class EnterResetcodeComponent implements OnInit {
  codeForm: FormGroup;
  email: string;
  public resetCodeRequest = {} as ResetCodeRequest;
  constructor(private fb: FormBuilder, private userService: UserService, private alertify: AlertifyService, 
    private router: Router,private routeParams:ActivatedRoute) { 

      this.routeParams.queryParams.subscribe(params => {
        this.email = params["email"];
      });
    }

  ngOnInit() {
    this.codeForm = this.fb.group({
      code: ['', Validators.required],
      email:['']
    });
  }

  OnSubmit(resetCode: any){
    this.resetCodeRequest.code = resetCode.controls.code.value.toString();
    this.resetCodeRequest.email = this.email;
    this.userService.getRecoveryRight(this.resetCodeRequest).subscribe((response) => {
      this.alertify.success('Success! Redirecting..');
      let navigationExtras: NavigationExtras = {
        queryParams: {
            "email":this.email,
            "resetEncryptionCode": response.responseBody.content.resetEncryptionCode
        }
      };
      this.router.navigate(['/password-recovery'],navigationExtras);
    }, error => {
      this.alertify.error(error.message);
    });
  }

}
