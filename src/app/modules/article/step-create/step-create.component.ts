import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AlertifyService } from "../../../_services/alertify.service";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { StepService } from "../../../_services/step/step.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ResponseModel,
  ResponseSearchModel,
} from "../../../request/response-model";
import { Article } from "../../../_models/article";
import { ArticleService } from "../../../_services/article/article.service";
import { Step } from "../../../_models/step";
import { Subscription } from "rxjs";
import { ArticleViewComponent } from "../article-view/article-view.component";
import { ArticleViewService } from "src/app/_services/article/article-view.service";

@Component({
  selector: "app-step-create",
  templateUrl: "./step-create.component.html",
  styleUrls: ["./step-create.component.css"],
})
export class StepCreateComponent implements OnInit {
  articleCode: any;
  article: Article;
  steps: Step[] = [];
  stepsForNav: Step[];
  articleForNav: Article;
  subscription: Subscription;
  pageNo: number = 1;
  totalRowCount: number;
  isNext: boolean;
  isPrevious: boolean = false;
  isBook: boolean = false;
  stepForm : FormGroup
  constructor(
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private stepService: StepService,
    private params: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private articleViewService: ArticleViewService
  ) {
    this.stepForm = this.fb.group({
      articleId: ["", Validators.required],
      articleCode: ["", Validators.required],
      content: ["", Validators.required],
      title: ["", Validators.required],
      isDraft: [""],
    });
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

  customOptions = {
    placeholder: "Write your story...",
    readOnly: false,
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "header",
      "list",
      "link",
      "image",
      "video",
      "clean",
    ],
  };

  styles = {
    height: "500px",
    overflow: "auto",
  };
  ngOnInit() {
    this.articleCode = this.params.snapshot.paramMap.get("articleId");
    this.stepForm.get("articleCode").setValue(this.articleCode);
    this.getArticle(this.articleCode);
    this.getArticleForNavigation(this.articleCode);
    this.stepForm.value["articleCode"] = this.articleCode;
    this.subscription = this.articleViewService.listen().subscribe((m: any) => {
      this.getStep(m);
      this.pageNo = m;
    });
  }
  getStep(pageNo) {
    const searchQuery: any = {
      Filters: {
        ArticleId: this.articleCode.toString(),
      },
      Paging: {
        PageNo: pageNo,
        PageSize: 1,
      },
      Sorting: [
        {
          ColumnName: "id",
          SortOrder: "ASC",
        },
      ],
    };

    this.stepService.getSteps(searchQuery).subscribe(
      (response: ResponseSearchModel) => {
        this.steps = response.responseBody.content.entities;
        this.setValues();
        this.totalRowCount =
          response.responseBody.content.pagination.totalRowCount;
        this.isNext = response.responseBody.content.pagination.nextPage;
        this.isPrevious = response.responseBody.content.pagination.previousPage;
        this.isBook =
          response.responseBody.content.entities[0].article.article_type === 2
            ? true
            : false;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  setValues() {
    if (this.steps.length > 0) {
      this.stepForm.controls["content"].setValue(this.steps[0].content);
      this.stepForm.controls["title"].setValue(this.steps[0].title);
    }
  }

  NextStep() {
    this.pageNo += 1;
    this.getStep(this.pageNo);
  }
  previousStep() {
    this.pageNo -= 1;
    this.getStep(this.pageNo);
  }

  OnSubmit(stepForm) {
    this.stepForm.get("isDraft").setValue(false);
    this.articleService.draftArticle(this.articleCode).subscribe(
      () => {
        this.alertify.success("Article Drafted successfully!");
        if (this.article.articleType === 1) {
          this.router.navigate([
            "/article-view/reader/articleReader/",
            this.articleCode,
          ]);
        } else {
          this.router.navigate([
            "/article-view/reader/bookReader/",
            this.articleCode,
          ]);
        }
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  DraftArticle(stepForm) {
    this.stepForm.controls["isDraft"].setValue(true);
    this.stepService.addStep(stepForm.value).subscribe(
      () => {
        this.alertify.success("Article Drafted successfully!");
        if (this.article.articleType === 1) {
          this.router.navigate([
            "/article-view/" + this.articleCode + "/reader/articleReader/",
            this.articleCode,
          ]);
        } else {
          this.router.navigate([
            "/article-view/" + this.articleCode + "/reader/bookReader/",
            this.articleCode,
          ]);
        }
        this.articleService.draftArticle(this.articleCode).subscribe(
          () => {},
          (error) => {
            this.alertify.error(error.message);
          }
        );
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  getArticle(articleId) {
    this.articleService.getArticle(articleId).subscribe(
      (response: ResponseModel) => {
        this.article = response.responseBody.content;
        this.stepForm.get("articleId").setValue(this.article.id);
        this.steps = this.article.steps;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  // OnNext(stepForm) {
  //   this.stepService.addStep(stepForm.value).subscribe(
  //     () => {
  //       this.alertify.success("Step added successfully!");
  //       this.router.navigate(["/step-create/", this.articleCode]);
  //       this.stepForm.get("title").setValue("");
  //       this.stepForm.get("content").setValue("");
  //       this.getArticle(this.articleCode);
  //       this.getArticleForNavigation(this.articleCode);
  //     },
  //     (error) => {
  //       this.alertify.error(error.message);
  //     }
  //   );
  // }

  OnNext(stepForm) {
    if (this.steps.length > 0) {
      this.stepService.editStep(stepForm.value, this.steps[0].id).subscribe(
        () => {
          this.alertify.success("Step updated successfully!");

          this.router.navigate(["/step-edit/", this.articleCode]);
          this.getArticle(this.articleCode);
          this.getArticleForNavigation(this.articleCode);
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    } else {
      this.stepService.addStep(stepForm.value).subscribe(
        () => {
          this.alertify.success("Step added successfully!");

          this.router.navigate(["/step-edit/", this.articleCode]);
          this.getArticle(this.articleCode);
          this.getArticleForNavigation(this.articleCode);
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    }
  }

  getArticleForNavigation(id: number) {
    this.articleService.getArticleForNavigation(id).subscribe(
      (response: ResponseModel) => {
        this.articleForNav = response.responseBody.content;
        this.stepsForNav = this.articleForNav.steps;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }
}
