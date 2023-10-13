import { Component, OnInit } from "@angular/core";
import { ArticleService } from "src/app/_services/article/article.service";
import { ResponseSearchModel } from "src/app/request/response-model";
import { Article } from "src/app/_models/article";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-user-content",
  templateUrl: "./user-content.component.html",
  styleUrls: ["./user-content.component.css"],
})
export class UserContentComponent implements OnInit {
  articles: Article[];
  articleType: string;
  userId: string;
  constructor(
    private articleService: ArticleService,
    private alertify: AlertifyService,
    private params: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.params.snapshot.paramMap.get("id");
    this.loadArticles();
  }

  loadArticles() {
    const searchQuery: any = {
      Filters: {
        SubCategory: "",
        Title: "",
        ArticleType: this.articleType,
        UserName: this.userId,
        IncludeDraft: true,
      },
      Paging: {
        PageNo: 1,
        PageSize: 50,
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
        this.articles = response.responseBody.content.entities;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  //Adding filters
  filterConfiguration(): any {
    const filters: any = {};

    return filters;
  }

  goToEdit(articleid) {
    this.router.navigate(["/step-edit/", articleid]);
  }
}
