import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLoginService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService: AuthLoginService,
    private router: Router,
    private alertify: AlertifyService
  ){}

  canActivate(next: ActivatedRouteSnapshot) : boolean {
    const roles = next.firstChild.data['roles'] as Array<string>;
    if(roles){
      const match = this.authService.isRoleMatch(roles);
      if(match){
        return true;
      }else{
        this.alertify.error("Not authorized");
        this.router.navigate(["/unauthorized"]);
        return false;
      }
    }
    if(this.authService.loggedIn())
    {
      return true;
    } 

    this.alertify.error("Please login");
    this.router.navigate(['/home']);
    return false;
  }
}
