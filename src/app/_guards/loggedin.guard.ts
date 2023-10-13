import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthLoginService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class LoggedInAuthGuard  {

    constructor(private authService: AuthLoginService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.loggedIn()) {
            this.router.navigate(['/userhome'])
            return false
        } else {
            return true
        }
    }
}