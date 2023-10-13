import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ArticleLayourViewService } from "src/app/_services/article/article-layout-view.service";
import {
  ResponseModel,
  ResponseSearchModel,
} from "../../../request/response-model";
import { Article } from "../../../_models/article";
import { ArticleSearchRequest } from "../../../_requestModels/articleSearchRequest";
import { AlertifyService } from "../../../_services/alertify.service";
import { ArticleService } from "../../../_services/article/article.service";
import { CategoryService } from "../../../_services/catgory/category.service";

@Component({
  selector: "app-book-list",
  templateUrl: "./book-list.component.html",
  styleUrls: ["./book-list.component.css"],
})
export class BookListComponent implements OnInit {
  articles: Article[];
  articleType: number = 2;
  items: any;
  isLoading: boolean;
  categories: any;
  public articleSearchRequest = {} as ArticleSearchRequest;
  subCategories: any;
  public keyword = "queryString";
  searchForm:FormGroup;
  
  constructor(
    private articleService: ArticleService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private articleLayoutViewService: ArticleLayourViewService
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      queryString: [""],
      category: [0],
      subCategory: [0]
    });
    this.articleSearchRequest.title = "";
    this.articleSearchRequest.category = "0";
    this.articleSearchRequest.subCategory = "0";
    this.loadArticles(this.articleSearchRequest);
    this.getCategories();
    this.articleLayoutViewService.changeHeaderimage(
      "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/a009-kaboompics-758.jpg?w=1300&dpr=1&fit=default&crop=default&q=80&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=b02dab31b55f6b69adfc43ad0e2ca3f8"
    );
  }

  loadArticles(search: ArticleSearchRequest) {
    this.isLoading = true;
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
          ColumnName: "Title",
          SortOrder: "ASC",
        },
      ],
    };

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
    const searchQuery: any = {
      Filters: {
        SubCategory: "",
        Category: "",
        Title: val,
        ArticleType: this.articleType,
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
    this.articleSearchRequest.subCategory = id.toString();
    this.loadArticles(this.articleSearchRequest);
  }

  onCategoryChange(id: number) {
    this.getSubCategories(id);
    this.articleSearchRequest.category = id.toString();
    if (id == 0) {
      this.articleSearchRequest.subCategory = "0";
    }
    this.loadArticles(this.articleSearchRequest);
  }
}
