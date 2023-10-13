import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CoverType } from "src/app/enums/common.enums";

@Injectable({
    providedIn: 'root',
  })
  export class ArticleLayourViewService {
    private _imageUrl: string = 'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/a009-kaboompics-758.jpg?w=1300&dpr=1&fit=default&crop=default&q=80&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=b02dab31b55f6b69adfc43ad0e2ca3f8';
    subject = new Subject();
    userSubject = new Subject();
    private recentArticles : any;
    private user: any;
    coverType: CoverType;

    changeHeaderimage(newUrlInfo: any) {
      this._imageUrl = newUrlInfo.url;
      this.coverType = newUrlInfo.coverType;
      this.subject.next({_imageUrl:this._imageUrl,_coverType:this.coverType});
    }

    passUser(user: any){
      this.user = user;
      this.userSubject.next(this.user);
    }
  
    clear() {
      this._imageUrl = 'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/a009-kaboompics-758.jpg?w=1300&dpr=1&fit=default&crop=default&q=80&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=b02dab31b55f6b69adfc43ad0e2ca3f8';
      this.subject.next(this._imageUrl);
    }

    passRecents(recentObj: any) {
      this.recentArticles = recentObj;
      this.subject.next(this.recentArticles);
    }
  }