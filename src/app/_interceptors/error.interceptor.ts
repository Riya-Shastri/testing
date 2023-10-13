import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AlertifyService } from "../_services/alertify.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private alertify: AlertifyService) { }
debug;
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError(error => {
                if (error) {
                    switch (error.status) {
                        case 400:
                            if (error.error.errors) {
                                const modelStateErrors = [];
                                for (const key in error.error.errors) {
                                    if (error.error.errors[key]) {
                                        modelStateErrors.push(error.error.errors[key]);
                                        //console.log(modelStateErrors);
                                    }
                                }
                                throw modelStateErrors.flat();
                            }
                            break;
                        case 401:
                            this.alertify.error("You are not authorized!");
                            this.router.navigateByUrl('/unauthorized');
                            break;
                        case 404:
                            this.router.navigateByUrl('/notFound');
                            break;
                        case 500:
                            if (error.error) {
                                this.alertify.error(error.error.errorMessage.message);
                            }
                            break;
                        default:
                            this.alertify.warning('Something unexpected happended! Please contact the system administrator!');
                            break;
                    }
                }

                if (error.error) {
                    if (error.error.errorMessage) {
                        return throwError(error.error.errorMessage);
                    }
                } else {
                    error.message = "You are not Authorized!";
                }

                return throwError(error);
            })
        );
    }
}