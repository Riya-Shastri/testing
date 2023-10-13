import { AfterViewInit, HostListener } from "@angular/core";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { strictEqual } from "assert";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { interval, Subscription } from "rxjs";
import { CoverType } from "src/app/enums/common.enums";
import {
  ResponseModel,
  ResponseSearchModel,
} from "src/app/request/response-model";
import { HighlightAdd } from "src/app/request/step/step.edit";
import { Article } from "src/app/_models/article";
import { Step } from "src/app/_models/step";
import { User } from "src/app/_models/user";
import { AddBookMark } from "src/app/_requestModels/addBookmarkRequest";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ArticleLayourViewService } from "src/app/_services/article/article-layout-view.service";
import { ArticleViewService } from "src/app/_services/article/article-view.service";
import { ArticleService } from "src/app/_services/article/article.service";
import { AuthLoginService } from "src/app/_services/auth.service";
import { CartViewService } from "src/app/_services/cart/cart-view.service";
import { CartService } from "src/app/_services/cart/cart.service";
import { UtilityViewService } from "src/app/_services/common/utility.view.service";
import { StepService } from "src/app/_services/step/step.service";
import { UserService } from "src/app/_services/user.service";
import { ArticleEditModalComponent } from "../../article-edit-modal/article-edit-modal.component";
import { Meta } from "@angular/platform-browser";
declare const Waypoint: any;
@Component({
  selector: "app-article-reader",
  templateUrl: "./article-reader.component.html",
  styleUrls: ["./article-reader.component.scss"],
})
export class ArticleReaderComponent implements OnInit, AfterViewInit {
  article: Article;
  articleId: any;
  steps: Step[];
  fontSize: number = 18;
  stepsForNav: Step[];
  articleForNav: Article;
  public articleForNavObj = {} as Article;
  pageNo: number = 1;
  userObj: User;
  stepId: number;
  IsClickScroll: boolean = false;
  totalRowCount: number;
  public href: string = "";
  isNext: boolean;
  isPrevious: boolean = false;
  isBook: boolean = false;
  containerStyle: any;
  comments: any;
  commentCount: number;
  userId: number;
  currentUser: any;
  requestRunning: boolean;
  content: any = "";
  isReadCounted: boolean;
  isLoading: boolean = true;
  isAdmin: boolean;
  isSameUser: boolean;
  isLoggedIn: boolean;
  modalRef: BsModalRef;
  onLoadOnly: boolean;
  highlitedText: any;
  readerStyles: any;
  currentStep: any;
  isClsVisible: boolean = false;
  styleType: number = 0; //0 = normal, 1= dark mode, 2=white fullscreen ,3 = dark fullscreen
  subscription: Subscription;
  commentSubscription: Subscription;
  countComments: any;
  @Input() StepIdFromNav: number;
  @ViewChild("editor") editor: ElementRef;
  @ViewChild("editorContainer") editorContainer: ElementRef;
  subscriptionAutoSave: Subscription;
  commentForm:FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private params: ActivatedRoute,
    private router: Router,
    private stepService: StepService,
    private articleViewService: ArticleViewService,
    private articleService: ArticleService,
    private alertify: AlertifyService,
    private modalService: BsModalService,
    route: ActivatedRoute,
    private cartService: CartService,
    private cartViewService: CartViewService,
    private utilityViewService: UtilityViewService,
    private articleLayoutViewService: ArticleLayourViewService,
    private userService: UserService,
    private authLoginService: AuthLoginService,
    private meta: Meta
  ) {
    //no longer needed
    // this.commentSubscription = this.articleViewService.listenBackRefresh().subscribe((m: any) => {
    //   if (m) {
    //     this.getComments();
    //   }
    // })

    //emit value in sequence every 10 second
    const source = interval(10000);
    //this.subscriptionAutoSave = source.subscribe(val => this.autoSavedBookMark());
  }

  stepReadForm = this.fb.group({
    content: ["", Validators.required],
  });

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: ["", Validators.required],
    });
  
    this.articleId = this.params.snapshot.paramMap.get("id");
    this.getArticle(this.articleId);
    this.getStep(this.pageNo);
    this.onLoadOnly = true;
    this.href = location.pathname;
    this.currentUser = sessionStorage.getItem("id");
    if (this.isLoggedIn === true && this.currentUser > 2) {
      this.getCurrentUser();
    }
    this.isLoggedIn = this.utilityViewService.isLoggedIn();
    if (this.isLoggedIn) {
      this.isAdmin = this.utilityViewService.isAdminUser();
    }
    //this.getComments();
    this.OnLoadStyle();
    this.getComments();

    this.subscription = this.articleViewService
      .listenAnchor()
      .subscribe((m: any) => {
        //this.isLoading = true;
        this.getStep(m);
        this.pageNo = m;
        this.stepId = m;
        this.scroll(m);
        this.autoSavedBookMark();
      });

    this.setValues();
  }

  updateMetaTags(articleData: any) {
    this.meta.updateTag({
      property: "og:title",
      content: articleData.title,
    });
    this.meta.updateTag({
      property: "og:description",
      content: articleData.description,
    });
    this.meta.updateTag({
      property: "og:image",
      content: articleData.frontPage,
    });
    // Update other meta tags as needed
  }


  emitArticleInfo(): void {
    this.articleViewService.passArticle(this.article);
  }

  emitSelectedStepInfo(stepId): void {
    this.articleViewService.passAnchor(stepId);
  }
  OnSubmit(event) {
    this.addComments();
  }
  getArticle(id: string) {
    this.isLoading = true;
    this.articleService.getArticleForNavigation(id).subscribe(
      (response: ResponseModel) => {
        this.article = response.responseBody.content;
        this.userId = response.responseBody.content.userId;
        this.emitArticleInfo();
        this.emitSelectedStepInfo(this.stepId);
        this.articleLayoutViewService.changeHeaderimage({
          url: this.article.frontPage,
          coverType: CoverType.ArticleReaderCover,
        });
        this.isSameUser = this.article?.isSameUser;
        this.updateMetaTags(this.article);
        this.isLoading = false;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    //this.commentSubscription.unsubscribe();
    this.subscriptionAutoSave?.unsubscribe();
  }

  setValues() {
    this.stepReadForm.controls["content"].setValue(this.content);
    this.GetCurrentBookMark();
  }

  // getArticleForNavigation(id: number, stepId: number) {
  //   this.spinner.show();
  //   this.articleService.getArticleForNavigationWithStepId(id, stepId).subscribe((response: ResponseModel) => {
  //     this.articleForNav = response.responseBody.content;
  //     this.stepsForNav = this.articleForNav.steps;
  //     this.isBook = response.responseBody.content.articleType === 2 ? true : false;
  //     this.emitArticleInfo();
  //     this.spinner.hide();
  //   }, error => {
  //     this.alertify.message(error);
  //     this.spinner.hide();
  //   });
  // }

  editArticleInfo(article: any) {
    const initialState = {
      article,
    };
    this.modalRef = this.modalService.show(ArticleEditModalComponent, {
      initialState,
    });
    this.modalRef.content.editArticle.subscribe((values) => {
      const articleForm = {
        comment: values.value.comment,
        articleId: this.article.articleCode,
        minPrice: values.value.minPrice,
        title: values.value.title,
        articleType: values.value.articleType,
        imageType: values.value.imageType,
        frontPage: values.value.frontPage.url,
        isEnabled: true,
        subCategoryId: values.value.subCategory,
        description: values.value.description,
      };
      if (values) {
        this.articleService
          .editArticle(articleForm, this.article.articleCode)
          .subscribe(
            (response: ResponseModel) => {
              //this.spinner.show();
              this.getComments();
              this.getArticle(this.article.articleCode);
              this.alertify.success("Aricle basic info editted successfully!");
            },
            (error) => {
              this.alertify.error(error.message);
            }
          );
      }
    });
  }

  getStep(pageNo) {
    //this.isLoading = true;
    this.stepService.getStepsOfArticle(this.articleId).subscribe(
      (response: any) => {
        this.steps = response.responseBody.content;
        this.stepsForNav = this.steps;
        this.content = "";
        for (var i = 0; i < this.steps.length; i++) {
          var tag =
            "<div class='episode'>" +
            "<p class=#" +
            this.steps[i].id +
            ">" +
            "</div>";
          if (this.steps[i].content) {
            this.content +=
              tag +
              "<b>" +
              this.steps[i].title +
              "<b/></p>" +
              "<br>" +
              this.steps[i].content;
          }
        }
        if (this.stepId) {
        } else {
        }

        this.buildFinalContent();
        this.setValues();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  NextStep() {
    this.pageNo += 1;
    this.getStep(this.pageNo);
  }

  previousStep() {
    this.pageNo -= 1;
    this.getStep(this.pageNo);
  }

  highlight(highlighted) {
    if (this.isLoggedIn) {
      return this.content.replace(new RegExp(highlighted, "gi"), (match) => {
        return '<span class="highlightText">' + match + "</span>";
      });
    }
  }

  public handleClick(event: any) {
    if (this.isLoggedIn) {
      let selection;
      document.addEventListener("selectionchange", (event) => {
        selection = document.getSelection
          ? document.getSelection().toString()
          : "";
        this.highlitedText = selection;
      });

      this.content = this.content.replace(
        this.highlitedText,
        '<span class="highlightText">' + this.highlitedText + "</span>"
      );
      this.saveHighlight(this.steps[0].id, this.highlitedText);
    }
  }

  saveHighlight(stepId, highlightedText) {
    if (
      this.isLoggedIn &&
      highlightedText != null &&
      highlightedText.length > 0
    ) {
      var highlight: HighlightAdd = {
        highlightedPart: highlightedText,
        stepId: stepId,
      };
      this.stepService.addHighlight(highlight).subscribe(
        () => {
          this.alertify.success("Hightlight added successfully!");
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    }
  }

  buildFinalContent() {
    if (this.steps.length > 0) {
      this.steps[0].highlights.forEach((element) => {
        this.content = this.content.replace(
          element.highlitedPart,
          '<span class="highlightText" (mouseover)="onHoverHighlite($event)">' +
            element.highlitedPart +
            "</span>"
        );
      });
    }
  }

  onHoverHighlite(e) {}

  scroll(className: any) {
    const classElement = document.getElementsByClassName("#" + className);
    if (classElement.length > 0) {
      classElement[0].scrollIntoView();
    }
  }

  @HostListener("window:scroll", ["$event"]) onScrollEvent($event) {
    this.anchorSearch();
  }

  anchorSearch() {
    var elements = document.querySelectorAll("[class*='#']");
    var visibleElement;
    for (var i = 0; i < elements.length; i++) {
      if (this.elementInViewport(elements[i])) {
        visibleElement = elements[i];
        break;
      }
    }

    if (visibleElement && visibleElement.className) {
      var classname = visibleElement.className.slice(1);
      this.stepId = parseInt(classname);
      this.emitSelectedStepInfo(this.stepId);
    }
  }

  deleteArticle() {
    this.articleService.deleteArticle(this.articleId).subscribe(
      (response: ResponseModel) => {
        this.router.navigate(["/article-list"]);
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }
  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };
  elementInViewport(el) {
    var top = el.offsetTop + 10;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      top + height <= window.pageYOffset + window.innerHeight &&
      left + width <= window.pageXOffset + window.innerWidth
    );
  }

  getComments() {
    //this.spinner.show();
    const searchQuery: any = {
      Filters: {
        ArticleId: this.articleId,
      },
      Paging: {
        PageNo: 1,
        PageSize: 10,
      },
      Sorting: [
        {
          ColumnName: "CreatedDate",
          SortOrder: "DESC",
        },
      ],
    };

    this.articleService.getComments(searchQuery).subscribe(
      (response: ResponseSearchModel) => {
        this.comments = response.responseBody.content.entities;
        //this.spinner.hide();
        this.commentCount =
          response.responseBody.content.pagination.totalRowCount;
        //this.emitArticleInfo();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  ngAfterViewInit() {
    //this.spinner.hide();
  }

  ToDarkModeFullScreen() {
    //0 = normal, 1= dark mode, 2=white fullscreen ,3 = dark fullscreen
    this.styleType = 3;
    this.isClsVisible = true;
    this.editorContainer.nativeElement.class = "dark-mode";
  }

  ToDarkMode() {
    this.isClsVisible = true;
    this.styleType = 1;
  }

  ToFullScreenMode() {
    this.isClsVisible = true;
    this.styleType = 2;
  }

  exitFullscreen() {
    this.isClsVisible = false;
    this.styleType = 0;
  }

  GetSliderValue(event) {
    this.fontSize = parseInt(event.target.value);
    this.SetStyles();
  }

  OnLoadStyle() {
    this.fontSize = this.fontSize;
    this.SetStyles();
    var clsbutton = document.getElementsByClassName("cls-button");
  }

  SetStyles(): object {
    switch (this.styleType) {
      case 2:
        return {
          "background-color": "#fff",
          position: "static",
          color: "#020202 !important",
          left: 0,
          "z-index": "9999999999999999999999999",
          padding: "50px",
          right: 0,
          top: 0,
          "font-size": this.fontSize.toString() + "px !important",
        };
      case 1:
        return {
          color: "#fff !important",
          "background-color": "#232323",
          "font-size": this.fontSize.toString() + "px",
        };
      case 0:
        return {
          "background-color": "#fff !important",
          color: "#000 !important",
          "font-size": this.fontSize.toString() + "px",
        };
      case 3:
        return {
          "background-color": "#232323 !important",
          position: "absolute",
          color: "#fff !important",
          left: 0,
          "z-index": "9999999999999999999999999",
          padding: "50px",
          right: 0,
          top: 0,
          "font-size": this.fontSize.toString() + "px",
        };
      default:
        return {};
    }
  }

  autoSavedBookMark() {
    if (this.stepId && this.isLoggedIn) {
      var bookmark: AddBookMark = {
        bookmarkLocation: this.stepId.toString(),
        stepId: this.stepId,
        title: "Autosaved Bookmark",
        articleId: this.article.articleCode.toString(),
      };
      this.articleService.saveBookMark(bookmark).subscribe(
        (response: ResponseModel) => {},
        (error) => {}
      );
    }
  }

  GetCurrentBookMark() {
    if (this.isLoggedIn) {
      //this.isLoading = true;
      this.articleService.getCurrentBookMark(this.articleId).subscribe(
        (response: ResponseModel) => {
          this.isLoading = false;
          if (response.responseBody.content) {
            if (this.onLoadOnly == true) {
              this.stepId = response.responseBody.content.stepId;
              this.scroll(this.stepId);
            }
            this.onLoadOnly = false;
          }
        },
        (error) => {
          this.alertify.message(error);
        }
      );
    }
    //this.isLoading = false;
  }

  addComments() {
    const commentDto = {
      comment: this.commentForm.value["comment"],
      articleId: this.articleId,
    };
    this.articleService.addComment(commentDto).subscribe(
      (response: ResponseModel) => {
        //this.spinner.show();
        this.comments.unshift(response.responseBody.content);
        this.alertify.success("Comment added successfully!");
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  getCurrentUser() {
    this.userService.getUser(this.currentUser).subscribe(
      (response: ResponseModel) => {
        //this.spinner.show();
        this.userObj = response.responseBody.content;
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  loadComments() {
    const searchQuery: any = {
      Filters: {
        ArticleId: this.articleId,
      },
      Paging: {
        PageNo: 1,
        PageSize: 10,
      },
      Sorting: [
        {
          ColumnName: "CreatedDate",
          SortOrder: "DESC",
        },
      ],
    };

    this.articleService.getComments(searchQuery).subscribe(
      (response: ResponseSearchModel) => {
        this.countComments =
          response.responseBody.content.pagination.totalRowCount;
        for (
          var i = 0;
          i <= response.responseBody.content.entities.length - 1;
          i++
        ) {
          this.comments.push(response.responseBody.content.entities[i]);
        }
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  IsLoggedIn() {
    return this.authLoginService.loggedIn();
  }
}
