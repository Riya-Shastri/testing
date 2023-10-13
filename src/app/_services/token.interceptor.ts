import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class TokenInterceptorService implements HttpInterceptor {
  
    constructor() { }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let tokenizedReq = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      return next.handle(tokenizedReq)
    }
  }