import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { CoverType } from 'src/app/enums/common.enums';
import { CoverImageUploadModalComponent } from 'src/app/modules/user/user/cover-image-upload-modal/cover-image-upload-modal.component';
import { User } from 'src/app/_models/user';
import { ArticleLayourViewService } from 'src/app/_services/article/article-layout-view.service';

@Component({
  selector: 'app-cover-layout',
  templateUrl: './cover-layout.component.html',
  styleUrls: ['./cover-layout.component.css']
})
export class CoverLayoutComponent implements OnInit {
  backgroundurl: any;
  heightCalcualted: any = 0;
  user: any;
  unsubscribe: Subscription;
  unsubscribeArticle: Subscription;
  coverType: CoverType; modalRef: BsModalRef; coverStyle: any;
  constructor(private articlelayoutService: ArticleLayourViewService, private modalService: BsModalService) {
    this.loadImage();
    this.loadUser();
  }

  ngOnInit(): void {
    
    this.loadUser();
  }

  loadImage() {
    this.unsubscribeArticle = this.articlelayoutService.subject.subscribe((newTitle: any) => {
      this.backgroundurl = newTitle._imageUrl;
      if (newTitle._coverType == CoverType.ArticleReaderCover) {
        this.heightCalcualted = (window.outerWidth / 2.5);
      } else if (newTitle._coverType == CoverType.ProfileCover) {
        this.heightCalcualted = (window.outerWidth / 4.188);
      } else {
        this.heightCalcualted = (window.outerWidth / 4.188);
      }
    })
  }

  loadUser() {
    this.unsubscribe = this.articlelayoutService.userSubject.subscribe((user) => {
      if (user) {
        this.user = user;
        this.backgroundurl = this.user.coverImage;
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
    this.unsubscribeArticle.unsubscribe();
  }

  openCoverUploadModal() {
    isAdd: Boolean;
    this.loadUser();
    if(this.user){
      
    const initialState = {
      user: this.user
    }
    
    this.modalRef = this.modalService.show(CoverImageUploadModalComponent, { initialState });
    //this.loadCoverStyles();
    }
  }
  loadCoverStyles() {
    this.coverStyle = {
      "background-image": "url(" + this.user.coverImage + ") !important;"
    }
  }

}
