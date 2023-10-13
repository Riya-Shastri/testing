
  import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class LanguageInterceptor implements HttpInterceptor {
  
    constructor() { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(!req.url.includes('/api/')){
            const cloneReq = req.clone({url: req.url+ "?culture="+localStorage.getItem("preferredLanguage")});
            return next.handle(cloneReq);
        }
        return next.handle(req);
    }
  }