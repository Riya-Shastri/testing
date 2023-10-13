import { Component, HostListener, Input, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/_models/article';
import { Step } from 'src/app/_models/step';
import { ArticleViewService } from 'src/app/_services/article/article-view.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  subscription: Subscription;
  subscription2: Subscription;
  substeps: any;
  IsScrolled: boolean = false;
  articleName: string;
  frontPage: string
  public href: string;
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
  coverImage:any;
  commentCount: number;
  userJob: string;
  userId: number;
  closeButtonStyle: any;
  floaterStyle: any;
  userFloaterStyle: any;
  profileImage: string;
  boldStepId:any;
  modalRef: BsModalRef;
  widthChanged: boolean = false;
  @Input() steps: Step[];
  @Input() article: Article;
  
  constructor(private articleViewService: ArticleViewService) {
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
        this.boldStepId = m;
      }
    })
   }

  ngOnInit(): void {
    this.href = location.pathname;
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

  addFloaterClass(){
    const floater = {
      'position': 'fixed',
      'background-color': '#fff',
      'z-index': '99',
      'width': '329px',
      'border': '1px solid #ddd',
      /* padding: 5px; */
      'padding': '10px'
    }
  }

  visibleFloater(event: any){
    var element = document.getElementById("title-slide");
    if ((window.scrollY) > 600) {
      this.floaterStyle = {
        'position': 'fixed',
        'background-color': '#fff',
        'z-index': '99',
        'width': '329px',
        'border': '1px solid #ddd',
        /* padding: 5px; */
        'padding': '10px',
        'top': "20%"
      }
      let height = element.offsetHeight.toString()+'px';
      this.userFloaterStyle = {
        'position': 'fixed',
        'background-color': '#fff',
        'z-index': '99',
        'width': '329px',
        'border': '1px solid #ddd',
        /* padding: 5px; */
        'padding': '10px',
        'top': height
      }
     
    }else{
      this.floaterStyle = { 
        
      }
      this.userFloaterStyle = { 
        
      }
    }

  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.visibleFloater($event);
  }
  makeBold(stepId:any){
    if(this.articleType == 1){
      this.boldStepId =stepId;
    }
    // var elementBold = document.createElement("b");
    // elementBold.append(document.getElementById(documentId));
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
}
