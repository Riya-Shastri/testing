import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BindOptions } from 'dgram';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ArticleCommentModalComponent } from 'src/app/modules/article/article-info/article-comment-modal/article-comment-modal.component';
import { ResponseModel, ResponseSearchModel } from 'src/app/request/response-model';
import { Article } from 'src/app/_models/article';
import { Step } from 'src/app/_models/step';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ArticleViewService } from 'src/app/_services/article/article-view.service';
import { ArticleService } from 'src/app/_services/article/article.service';
import { UtilityViewService } from 'src/app/_services/common/utility.view.service';

@Component({
  selector: 'app-reader-layout',
  templateUrl: './reader-layout.component.html',
  styleUrls: ['./reader-layout.component.css']
})
export class ReaderLayoutComponent implements OnInit {
  @Input() steps: Step[];
  @Input() article: Article;
  substeps: any;
  IsScrolled: boolean = false;
  articleName: string;
  frontPage: string
  public href: string;
  subscription: Subscription;
  subscription2: Subscription;
  selectedStepId: any;
  articleType: any;
  articleId: any;
  sidebarWidth: any = '250px';
  userFirstname: string;
  userLastname: string;
  isAdmin: boolean;
  isSameUser: boolean;
  isLoading: boolean = true;
  isLoggedIn: boolean;
  isArticleSaved: boolean =false;
  comments: any;
  commentCount: number;
  userJob: string;
  userId: number;
  closeButtonStyle: any;
  floaterStyle: any;
  profileImage: string;
  modalRef: BsModalRef;
  widthChanged: boolean = false;

  @ViewChild('sticky-navbar') editor: ElementRef;
  constructor(private articleViewService: ArticleViewService, private articleService: ArticleService,private router: Router, private alertify: AlertifyService, private params: ActivatedRoute, private modalService: BsModalService,
    route: ActivatedRoute, private utilityViewService: UtilityViewService) {
    this.subscription = this.articleViewService.listenBackArticle().subscribe((m: any) => {
      if (m) {
        this.articleName = m.title;
        this.substeps = m.steps;
        this.articleId = m.articleCode;
        this.selectedStepId = m.selectedStepId;
        this.articleType = m.articleType;
        this.frontPage = m.frontPage;
        this.userId = m.userId;
        this.isArticleSaved = m.isSaved;
        this.userFirstname = m.firstName;
        this.userLastname = m.lastName;
        this.userJob = m.job;
        this.commentCount = m.commentCount;
        this.profileImage = m.profileImage;
      }
    })

    this.subscription2 = this.articleViewService.listenAnchorBack().subscribe((m: any) => {
      if (m) {
        this.isLoading = false;
        this.selectedStepId = m;
      }
    })
  }

  ngOnInit() {
    this.href = location.pathname;
    this.closeButtonStyle = {
      'position': 'absolute',
      'left': '90%',
      'padding': '5px',
      'background-color': '#fff',
      'width': '20px',
      'border-radius': '100%',
      'cursor': 'pointer',
    }
   
    this.isLoggedIn = this.utilityViewService.isLoggedIn();
    if (this.isLoggedIn) {
      this.isSameUser = this.utilityViewService.isSameUser(this.userId);
      this.isAdmin = this.utilityViewService.isAdminUser();
    }
  }

  emitSelectedId(event: any): void {
    // this.onFilter.emit('Register click');
    this.articleViewService.filter(event);
    this.selectedStepId = event;
  }

  emitSelectedAnchor(event: any): void {
    this.articleViewService.anchor(event);
  }

  emitCommentRefreshAnchor(): void {
    this.articleViewService.triggerRefresh();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
    this.subscription2.unsubscribe()
  }

  visibleFloater(event: any){
    var element = document.getElementById("floater-article");
    if ((window.scrollY) > 300) {
      this.floaterStyle = {
        'position': 'fixed',
        'top': '75px',
        /* right: 87%; */
        'right': '4%',
        // 'background-color': '#f8f9fa',
        'width': '170px',
        'height': 'auto',
        // 'border': '1px solid #ddd',
        'padding': '10px',
        'text-align': 'center',
        'border-radius': '1%',
        'cursor': 'pointer',
        'background-color':'#fff',
        'transition': 'all 0.5s ease 0s',
        'visibility': 'visible'
      }
      if(window.innerWidth < 900){
        this.floaterStyle = {
          'visibility': 'hidden'
        }
      }
    }else{
      this.floaterStyle = { 
        'visibility': 'hidden'
      }
    }

  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.visibleFloater($event)
  }

  changeWidth(event: any) {
    var element = document.getElementsByClassName('close-button');

    if (this.widthChanged) {
      this.sidebarWidth = '250px';
      this.closeButtonStyle = {
        'position': 'absolute',
        'left': '90%',
        'padding': '5px',
        'background-color': '#fff',
        'width': '20px',
        'border-radius': '100%',
        'cursor': 'pointer'
      }
      this.widthChanged = false;
    } else {
      this.sidebarWidth = '0px';
      this.closeButtonStyle = {
        'position': 'fixed',
        'left': '1%',
        'padding': '5px',
        'background-color': '#fff',
        'width': '20px',
        'border-radius': '100%',
        'cursor': 'pointer'
      }
      this.widthChanged = true;
    }

  }

  addArticleComment() {
    const initialState = {
      articleId : this.articleId,
      isLoggedIn : this.isLoggedIn
    }
    this.modalRef = this.modalService.show(ArticleCommentModalComponent, { initialState });
    this.modalRef.content.addComment.subscribe((values) => {
      // const commentDto = {
      //   comment: values.value.comment,
      //   articleId: this.articleId
      // }
      // if (values) {
      //   this.articleService.addComment(commentDto).subscribe((response: ResponseModel) => {
      //     //this.spinner.show();
      //     this.emitCommentRefreshAnchor();
      //     this.alertify.success('Comment added successfully!');
      //   }, error => {
      //     this.alertify.error(error.message);
      //   });
      // }
    })
  }

  makeBold(documentId:string){
    // var elementBold = document.createElement("b");
    // elementBold.append(document.getElementById(documentId));
  }

  saveArticle(){
    this.articleService.saveArticle(this.articleId).subscribe(() => {
      this.alertify.message("Article Saved");
      this.isArticleSaved = true;
    }, error => {
      this.alertify.message(error);
    });
  }

}

