import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ResponseModel } from "src/app/request/response-model";
import { ArticleLayourViewService } from "src/app/_services/article/article-layout-view.service";
import { AuthLoginService } from "src/app/_services/auth.service";
import { CategoryService } from "src/app/_services/catgory/category.service";

@Component({
  selector: "app-homesidebar",
  templateUrl: "./homesidebar.component.html",
  styleUrls: ["./homesidebar.component.scss"],
})
export class HomesidebarComponent implements OnInit {
  categories: any;
  subcategories: any;
  lastReadArticles: any;
  subscription: Subscription;
  constructor(
    private articlelayoutService: ArticleLayourViewService,
    private categoryService: CategoryService,
    private authService: AuthLoginService
  ) {}

  ngOnInit(): void {
    this.loadRecent();
    this.loadPopularCategories();
    this.loadPopularSubCategories();
  }

  loadRecent() {
    this.subscription = this.articlelayoutService.subject.subscribe(
      (receivingObj) => {
        this.lastReadArticles = receivingObj;
      }
    );
  }

  loadPopularCategories() {
    this.categoryService.getTopCategories(5).subscribe(
      (response: ResponseModel) => {
        this.categories = response.responseBody.content;
      },
      (error) => {}
    );
  }
  loggedIn() {
    return this.authService.loggedIn();
  }
  loadPopularSubCategories() {
    this.categoryService.getTopSubCategories().subscribe(
      (response: ResponseModel) => {
        this.subcategories = response.responseBody.content;
      },
      (error) => {}
    );
  }
}
