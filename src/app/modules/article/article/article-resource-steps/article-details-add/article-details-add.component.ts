import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseModel } from "src/app/request/response-model";
import { Article } from "src/app/_models/article";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ArticleService } from "src/app/_services/article/article.service";
import { CategoryService } from "src/app/_services/catgory/category.service";
import { EnumService } from "src/app/_services/common/enum.service";

@Component({
  selector: "app-article-details-add",
  templateUrl: "./article-details-add.component.html",
  styleUrls: ["./article-details-add.component.css"],
})
export class ArticleDetailsAddComponent implements OnInit {
  article: Article;
  articleType: number;
  articleForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private enumService: EnumService,
    private alertify: AlertifyService,
    private router: Router,
    private params: ActivatedRoute
  ) {}
  ngOnInit() {
    this.articleForm = this.fb.group({
      frontPage: ["", [Validators.required]],
    });
    let articleid = this.params.snapshot.paramMap.get("articleId");
    this.getArticle(articleid);
  }

  getArticle(id: string) {
    this.articleService.getArticle(id).subscribe(
      (response: ResponseModel) => {
        this.article = response.responseBody.content;
        this.articleType = this.article.articleType;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  getFrontPage(frontPage: any) {
    this.article.frontPage = frontPage.url;
  }

  OnSubmit() {
    this.articleService
      .editArticle(this.article, this.article.articleCode)
      .subscribe(
        (response: ResponseModel) => {
          this.alertify.success("Article details added successfully!");
          if (this.article.articleType == 1) {
            this.router.navigate(["/step-create/", this.article.articleCode]);
          } else {
            this.router.navigate(["/step-edit/", this.article.articleCode]);
          }
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
  }
}
