import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from "@angular/core";
import { ArticleService } from "../../../_services/article/article.service";
import { AlertifyService } from "../../../_services/alertify.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "../../../_models/article";
import { Step } from "../../../_models/step";
import {
  ResponseModel,
  ResponseSearchModel,
} from "src/app/request/response-model";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ArticleCommentModalComponent } from "./article-comment-modal/article-comment-modal.component";
import { Comments } from "src/app/_models/comments";
import { CartService } from "src/app/_services/cart/cart.service";
import { AddToCartRequest } from "src/app/_requestModels/addToCartRequest";
import { CartViewService } from "src/app/_services/cart/cart-view.service";
import { ArticleEditModalComponent } from "../article-edit-modal/article-edit-modal.component";
import { UtilityService } from "src/app/_services/utility/utility.service";
import { UtilityViewService } from "src/app/_services/common/utility.view.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-article-info",
  templateUrl: "./article-info.component.html",
  styleUrls: ["./article-info.component.css"],
  animations: [
    trigger("openClose", [
      // ...
      state(
        "open",
        style({
          height: "200px",
          opacity: 1,
          backgroundColor: "yellow",
        })
      ),
      state(
        "closed",
        style({
          height: "100px",
          opacity: 0.8,
          backgroundColor: "#c6ecff",
        })
      ),
      transition("open => closed", [animate("1s")]),
      transition("closed => open", [animate("0.5s")]),
    ]),
  ],
})
export class ArticleInfoComponent implements OnInit {
  article: Article;
  articleId: any;
  rate: any;
  public addToCartRequest = {} as AddToCartRequest;
  steps: Step[];
  modalRef: BsModalRef;
  comments: Comments;
  isAdmin: boolean;
  isSameUser: boolean;
  cartQuantity: number;
  isLoading: boolean = true;
  isLoggedIn: boolean;
  commentCount: number;
  @Output("getCartInfo") getCartInfo: EventEmitter<any> = new EventEmitter();
  featuredArticles: Article[];
  userId: any;
  commentForm : FormGroup
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private alertify: AlertifyService,
    private params: ActivatedRoute,
    private modalService: BsModalService,
    route: ActivatedRoute,
    private cartService: CartService,
    private cartViewService: CartViewService,
    private utilityViewService: UtilityViewService
  ) {
    route.params.subscribe((val) => {
      // put the code from `ngOnInit` here
      this.ngOnInit();
    });
    //this.router.routeReuseStrategy.shouldReuseRoute = ()=>false;
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: ["", Validators.required],
    });
    this.isLoading = true;
    this.articleId = this.params.snapshot.paramMap.get("id");
    this.rate = 4;
    this.getArticle(this.articleId);
    this.getComments();
    this.isLoggedIn = this.utilityViewService.isLoggedIn();

    if (this.isLoggedIn) {
      this.isSameUser = this.utilityViewService.isSameUser(this.userId);
      this.isAdmin = this.utilityViewService.isAdminUser();
    }
  }

  // ngAfterViewInit(){
  //   this.articleId = this.params.snapshot.paramMap.get('id');
  //   this.rate = 4;
  //   this.getArticle(this.articleId);
  //   this.getComments();
  // }

  getArticle(id: number) {
    this.isLoading = true;
    this.articleService.getArticle(id).subscribe(
      (response: ResponseModel) => {
        this.article = response.responseBody.content;
        this.userId = response.responseBody.content.userId;
        this.loadFeaturedArticles();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }
  closeOverlay() {
    //this.productService.filterBar = false;
  }
  openCommentBox(article: any) {
    const initialState = {
      article,
      articleId: this.article.articleCode,
      isLoggedIn: this.isLoggedIn,
    };
    this.modalRef = this.modalService.show(ArticleCommentModalComponent, {
      initialState,
    });
    this.modalRef.content.addComment.subscribe((values) => {
      const commentDto = {
        comment: values.value.comment,
        articleId: this.articleId,
      };
      if (values) {
        this.articleService.addComment(commentDto).subscribe(
          (response: ResponseModel) => {
            //this.spinner.show();
            this.getComments();
            this.alertify.success("Comment added successfully!");
          },
          (error) => {
            this.alertify.error(error.message);
          }
        );
      }
    });
  }

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
        articleId: this.articleId,
        minPrice: values.value.minPrice,
        isEnabled: true,
        title: values.value.title,
        articleType: values.value.articleType,
        imageType: values.value.imageType,
        frontPage: values.value.frontPage,
        subCategoryId: values.value.subCategory,
        description: values.value.description,
      };
      if (values) {
        this.articleService.editArticle(articleForm, this.articleId).subscribe(
          (response: ResponseModel) => {
            //this.spinner.show();
            this.getComments();
            this.getArticle(this.articleId);
            this.alertify.success("Aricle basic info editted successfully!");
          },
          (error) => {
            this.alertify.error(error.message);
          }
        );
      }
    });
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
      },
      (error) => {
        this.alertify.message(error);
        //this.spinner.hide();
      }
    );
  }

  @HostListener("window:scroll", ["$event"]) onScrollEvent($event) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // you're at the bottom of the page
    }
  }

  loadFeaturedArticles() {
    //this.spinner.show();
    const searchQuery: any = {
      Filters: {
        SubCategory: this.article.subCategoryId,
        articleType: 2,
      },
      Paging: {
        PageNo: 1,
        PageSize: 4,
      },
      Sorting: [
        {
          ColumnName: "CreatedDate",
          SortOrder: "DESC",
        },
      ],
    };

    this.articleService.getArticles(searchQuery).subscribe(
      (response: ResponseSearchModel) => {
        this.featuredArticles = response.responseBody.content.entities;
        //this.spinner.hide();
      },
      (error) => {
        this.alertify.message(error);

        this.isLoading = false;
        //this.spinner.hide();
      }
    );

    this.isLoading = false;
  }

  addToCart() {
    this.addToCartRequest.itemId = this.article.id;
    this.addToCartRequest.cartId = parseInt(localStorage.getItem("userData"));
    this.addToCartRequest.price = this.article.minPrice;
    this.addToCartRequest.quantity = this.cartQuantity;
    this.cartService.addToCart(this.addToCartRequest).subscribe(
      (response: ResponseSearchModel) => {
        this.emitCartInfo();
        //this.spinner.hide();
        //this.getCartInfo.emit();
      },
      (error) => {
        this.alertify.message(error);
        //this.spinner.hide();
      }
    );
  }

  emitCartInfo(): void {
    this.cartViewService.updateCount(true);
  }

  shareOffsite(socialMedia) {
    var gotoUrl = "";
    switch (socialMedia) {
      case "Instagram":
        break;
      case "Linkedin":
        gotoUrl =
          "https://www.linkedin.com/sharing/share-offsite/?url=" +
          window.location.href;
        break;
      case "Facebook":
        break;
      case "Twitter":
        break;
    }

    window.location.href = gotoUrl;
  }
  OnSubmit(event) {
    this.addComments();
  }
  addComments() {
    const commentDto = {
      comment: this.commentForm.value["comment"],
      articleId: this.articleId,
    };
    this.articleService.addComment(commentDto).subscribe(
      (response: ResponseModel) => {
        //this.spinner.show();
        this.comments = response.responseBody.content;
        this.alertify.success("Comment added successfully!");
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }
}
