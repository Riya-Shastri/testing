import { Component, OnInit } from "@angular/core";
import {
  ResponseModel,
  ResponseSearchModel,
} from "../../../request/response-model";
import { ArticleService } from "../../../_services/article/article.service";
import { AlertifyService } from "../../../_services/alertify.service";
import { Article } from "../../../_models/article";
import { ArticleSearchRequest } from "../../../_requestModels/articleSearchRequest";
import { CategoryService } from "src/app/_services/catgory/category.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ArticleLayourViewService } from "src/app/_services/article/article-layout-view.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { CoverType } from "src/app/enums/common.enums";

@Component({
  selector: "app-article-list",
  templateUrl: "./article-list.component.html",
  styleUrls: ["./article-list.component.css"],
})
export class ArticleListComponent implements OnInit {
  articles: Article[];
  articleType: number = 1;
  items: any;
  isLoading: boolean;
  categories: any;
  public articleSearchRequest = {} as ArticleSearchRequest;
  subCategories: any;
  subCategoryId: any;
  categoryId: any;
  href: any;
  public keyword = "queryString";
  searchForm: FormGroup

  constructor(
    private articleService: ArticleService,
    private alertify: AlertifyService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private articleLayoutViewService: ArticleLayourViewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      queryString: [""],
      category: [0],
      subCategory: [0],
      // steps:this.fb.array([
      // ])
    });
    this.getCategories();
    this.activatedRouter.queryParams.subscribe((params) => {
      this.categoryId = params['category'];
      this.subCategoryId = params['subcategory'];
      this.href = location.href;
    });
    this.router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd == true) {
        this.href = location.href;
        this.readCategoryifCategoryExist();
      }
    });
    this.articleSearchRequest.title = "";
    this.articleSearchRequest.category = "0";
    this.articleSearchRequest.subCategory = "0";
    this.loadArticles(this.articleSearchRequest);
    this.articleLayoutViewService.changeHeaderimage({
      url: "https://media.istockphoto.com/photos/dark-blue-minimal-texture-banner-with-space-for-text-word-or-product-picture-id1224392306?b=1&k=20&m=1224392306&s=170667a&w=0&h=lpDpUrttCoFDMhGQ1GJyyxIHE78s3xoMUzkawP5n4Y4=",
      coverType: CoverType.SubCategoryCover,
    });
  }


  loadArticles(search: ArticleSearchRequest) {
    this.isLoading = true;
    let userLanguageslist = String(localStorage.getItem("UserLanguages"));
    console.log(userLanguageslist);
    const searchQuery: any = {
      Filters: {
        SubCategory: search.subCategory,
        Title: search.title,
        Category: search.category,
        ArticleType: this.articleType,
        LocationInfo: localStorage.getItem("LocationInfo"),
        UserLanguages: localStorage.getItem("UserLanguages"),
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
    searchQuery.Filters.UserLanguages = userLanguageslist;
    this.articleService.getArticles(searchQuery).subscribe(
      (response: ResponseSearchModel) => {
        this.articles = response.responseBody.content.entities;

        this.isLoading = false;
      },
      (error) => {
        this.alertify.message(error);

        this.isLoading = false;
      }
    );
  }

  //Adding filters
  filterConfiguration(): any {
    const filters: any = {};

    return filters;
  }

  toggleType(e) {
    if (e == 1) {
      this.articleType = 1;
    } else {
      this.articleType = 2;
    }
  }

  readCategoryifCategoryExist() {
    subCategoryValue: Number;
    categoryValue: Number;
    let urlElements = this.href.split("/");

    if (this.href.indexOf("sub") !== -1) {
      this.categoryService.getSubCategoryByName(urlElements[5]).subscribe(
        (response: any) => {
          this.subCategoryId = response.responseBody.content.id;
          this.categoryId = response.responseBody.content.categoryId;
          this.onCategoryChange(this.categoryId);
          this.onSubCategoryChange(response.responseBody.content.id);
        },
        (error) => {
          this.alertify.message(error);

          this.isLoading = false;
        }
      );
    } else {
      this.categoryService.getCategoryByName(urlElements[4]).subscribe(
        (response: any) => {
          this.categoryId = response.responseBody?.content?.id;
          this.onCategoryChange(this.categoryId);
        },
        (error) => {
          this.alertify.message(error);

          this.isLoading = false;
        }
      );
    }
  }

  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.articleSearchRequest.title =
      this.searchForm.controls["queryString"].value;
    this.loadArticles(this.articleSearchRequest);
  }

  onFocused(e) {
    // do something when input is focused
  }

  loadAutoCompleteArticles(val: string) {
    this.isLoading = true;
    let userLanguageslist = localStorage.getItem("Languages");
    console.log();
    const searchQuery: any = {
      Filters: {
        SubCategory: "",
        Category: "",
        Title: val,
        ArticleType: this.articleType,
        LocationInfo: localStorage.getItem("LocationInfo"),
        UserLanguages: localStorage.getItem("Languages"),
      },
      Paging: {
        PageNo: 1,
        PageSize: 20,
      },
      Sorting: [
        {
          ColumnName: "Value",
          SortOrder: "ASC",
        },
      ],
    };

    this.articleService.getArticlesForAutoComplete(searchQuery).subscribe(
      (response: ResponseSearchModel) => {
        this.items = response.responseBody.content.entities;

        this.isLoading = false;
      },
      (error) => {
        this.alertify.message(error);

        this.isLoading = false;
      }
    );
  }

  public submitSearchForm() {}

  getSubCategories(id: number) {
    this.categoryService.getSubCategoryByCategory(id).subscribe(
      (response: ResponseModel) => {
        this.subCategories = response.responseBody.content;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (response: ResponseModel) => {
        this.categories = response.responseBody.content;
        this.readCategoryifCategoryExist();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  getSubCategory(id: number) {
    this.categoryService.getSubCategory(id).subscribe(
      (response: ResponseModel) => {},
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  onSubCategoryChange(id: number) {
    this.getSubCategory(id);

    this.subCategoryId = id;
    let coverUrl = this.subCategories?.filter((a) => a.id == id)[0]?.coverImage
      ? this.subCategories?.filter((a) => a.id == id)[0]?.coverImage
      : "https://media.istockphoto.com/photos/dark-blue-minimal-texture-banner-with-space-for-text-word-or-product-picture-id1224392306?b=1&k=20&m=1224392306&s=170667a&w=0&h=lpDpUrttCoFDMhGQ1GJyyxIHE78s3xoMUzkawP5n4Y4=";
    this.articleLayoutViewService.changeHeaderimage({
      url: coverUrl,
      coverType: CoverType.SubCategoryCover,
    });
    this.articleSearchRequest.subCategory = id.toString();
    this.loadArticles(this.articleSearchRequest);
  }

  onCategoryChange(id: number) {
    this.getSubCategories(id);
    this.categoryId = id;
    this.articleSearchRequest.category = id.toString();
    if (id == 0) {
      this.articleSearchRequest.subCategory = "0";
    }
    this.loadArticles(this.articleSearchRequest);
  }
}
