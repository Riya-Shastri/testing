import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormGroup} from "@angular/forms";
import { Router } from "@angular/router";
import { NgxMasonryOptions } from "ngx-masonry";
import {
  ResponseModel,
  ResponseSearchModel,
} from "src/app/request/response-model";
import { Article } from "src/app/_models/article";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ArticleLayourViewService } from "src/app/_services/article/article-layout-view.service";
import { ArticleService } from "src/app/_services/article/article.service";
import { CategoryService } from "src/app/_services/catgory/category.service";
import { Menu, NavService } from "src/app/_services/nav/nav.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  showName: boolean;
  pageNo: number = 1;
  articles: Array<Article> = [];
  totalElements: number;
  isNoContent: boolean = false;
  lastReadArticle: any;
  categories: [];
  public menuItems: Menu[];
  subCategories: any = [];
  isLoading: boolean;
  subcategoryForm: FormGroup;
  isLastReadLoading: boolean;
  articlesGeneric: Array<Article> = [];
  subsCollection: number[] = [];
  isDisabled: boolean;
  isFirstTimeLogin: boolean;
  public blogData: any;

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private subcategoryService: CategoryService,
    private router: Router,
    private alertify: AlertifyService,
    private userService: UserService,
    private articleLayoutViewService: ArticleLayourViewService,
    private navService: NavService,
    private categoryService: CategoryService
  ) {
    this.showName = false;
  }

  ngOnInit() {
    //this.GetLastReadArticle();
    this.loadArticles(1, this.pageNo);
    this.LoadCategories();
    this.isFirstTimeLogin = localStorage.getItem("isFirstTimeLogin") == "true";
    this.navService.clearAndPushMenu();
    //if(this.categories.length == 0){
    this.getCategories();
    //}
    //this.navService.clearMenu();
  }

  public myOptions: NgxMasonryOptions = {
    //transitionDuration: '0.8s',
    originTop: true,
  };

  loadArticles(articleType: number, pageNo: number) {
    this.isLoading = true;
    const searchQuery: any = {
      Filters: {
        SubCategory: "",
        Title: "",
        ArticleType: 1,
        LocationInfo: localStorage.getItem("LocationInfo"),
        UserLanguagesList: localStorage.getItem("Languages"),
      },
      Paging: {
        PageNo: pageNo,
        PageSize: 10,
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
        this.totalElements =
          response.responseBody.content.pagination.totalRowCount;
        for (
          var i = 0;
          i <= response.responseBody.content.entities.length - 1;
          i++
        ) {
          if (this.articles.length < this.totalElements) {
            if (
              this.articles.filter(
                (a) => a.id != response.responseBody.content.entities[i].id
              )
            ) {
              this.articles.push(response.responseBody.content.entities[i]);
            }
          }
        }
        this.isLoading = false;
      },
      (error) => {
        //this.alertify.message(error);
        this.isLoading = false;
      }
    );
  }

  goToEdit(articleid) {
    this.router.navigate(["/step-edit/", articleid]);
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY + 100 >=
      document.body.offsetHeight
    ) {
      // you're at the bottom of the page
      if (this.totalElements > this.articles.length) {
        this.pageNo += 1;
        this.loadArticles(1, this.pageNo);
        this.isNoContent = false;
      } else {
        this.isNoContent = true;
      }
    }
  }

  round100(x) {
    return Math.ceil(x / 10) * 10;
  }
  // @HostListener("window:scroll", ["$event"])
  // onWindowScroll() {
  //   // 200 is the height from bottom from where you want to trigger the infintie scroll, can we zero to detect bottom of window
  //   if ((document.body.clientHeight + window.scrollY + 20) >= document.body.scrollHeight) {

  //   }
  // }
  GetLastReadArticle() {
    this.isLastReadLoading = true;
    this.articleService.getLastReadArticle(1, 3).subscribe(
      (response: ResponseModel) => {
        this.lastReadArticle = response.responseBody.content;
        this.isLastReadLoading = false;
        this.articleLayoutViewService.passRecents(this.lastReadArticle);
      },
      (error) => {
        //this.alertify.message(error);
        this.isLastReadLoading = false;
      }
    );
  }

  OnSubmit(form) {}

  addToSubs(subId: number) {
    if (this.subsCollection.length == 10) {
      this.isDisabled = true;
      return false;
    } else {
      this.isDisabled = false;
    }
    this.subsCollection.push(subId);
  }

  removeFromSubs(subId) {
    this.subsCollection.forEach((value, index) => {
      if (value == subId) this.subsCollection.splice(index, 1);
    });
  }

  ifExisitInSubs(subId) {
    if (this.subsCollection.indexOf(subId) > -1) {
      return true;
    }
    return false;
  }

  LoadCategories() {
    if (localStorage.getItem("isFirstTimeLogin") == "true") {
      this.subcategoryService.getCategoriesForNavigation().subscribe(
        (response: any) => {
          this.categories = response.responseBody.content;
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    }
  }

  SaveSubs() {
    const requestObject = {
      SubCategoryCollection: this.subsCollection.join(),
    };
    this.userService.addSubCategories(requestObject).subscribe(
      (response: ResponseModel) => {
        this.alertify.success("Subcriptions added successfully!");
        localStorage.setItem("isFirstTimeLogin", "false");
        this.userService.updateFirstTimeLogin();
        this.isFirstTimeLogin = false;
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategoriesForNavigation().subscribe(
      (response: any) => {
        this.categories = response.responseBody.content;
        this.navService.items.subscribe((menuItems) => {
          this.menuItems = menuItems;
          this.menuItems[1].children = this.categories;
        });
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }
}
