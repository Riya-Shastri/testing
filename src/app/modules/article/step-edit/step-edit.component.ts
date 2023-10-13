import { Component, OnInit } from "@angular/core";
import { Article } from "src/app/_models/article";
import { Step } from "src/app/_models/step";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertifyService } from "src/app/_services/alertify.service";
import { StepService } from "src/app/_services/step/step.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ArticleService } from "src/app/_services/article/article.service";
import {
  ResponseModel,
  ResponseSearchModel,
} from "src/app/request/response-model";
import { StepEdit } from "src/app/request/step/step.edit";
import { ArticleViewService } from "src/app/_services/article/article-view.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-step-edit",
  templateUrl: "./step-edit.component.html",
  styleUrls: ["./step-edit.component.css"],
})
export class StepEditComponent implements OnInit {
  newStep: Step;
  articleCode: any;
  article: Article;
  steps: Step[] = [];
  stepsForNav: Step[];
  articleForNav: Article;
  pageNo: number = 1;
  totalRowCount: number;
  public href: string = "";
  isNext: boolean;
  isPrevious: boolean = false;
  isBook: boolean = false;
  subscription: Subscription;
  stepCollection: StepEdit;
  counter = 0;
  intervalId: any;
  stepForm : FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private alertify: AlertifyService,
    private stepService: StepService,
    private params: ActivatedRoute,
    private articleViewService: ArticleViewService,
    private router: Router,
    private articleService: ArticleService
  ) {
    this.stepForm = this.fb.group({
      articleId: ["", Validators.required],
      articleCode: ["", Validators.required],
      content: ["", Validators.required],
      title: ["", Validators.required],
      isEnabled: [true],
      isDraft: [false],
    });
  }


  ngOnInit() {
    this.articleCode = this.params.snapshot.paramMap.get("articleId");
    this.stepForm.get("articleCode").setValue(this.articleCode);
    this.getStep(this.pageNo);
    this.getArticle(this.articleCode);
    this.getArticleForNavigation(this.articleCode);
    this.subscription = this.articleViewService.listen().subscribe((m: any) => {
      this.getStep(m);
      this.pageNo = m;
    });
    this.intervalId = setInterval(() => {
      this.OnNext(this.stepForm, true);
    }, 60000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.intervalId);
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

  OnSubmit(stepForm) {
    stepForm.value["isEnabled"] = true;
    stepForm.value["isDraft"] = false;
    if (this.steps.length > 0) {
      this.stepService.editStep(stepForm.value, this.steps[0].id).subscribe(
        () => {
          this.alertify.success("Article published successfully!");
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
    } else {
      this.stepService.addStep(stepForm.value).subscribe(
        () => {
          this.alertify.success("Article published successfully!");
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
  }

  getArticle(articleId) {
    this.articleService.getArticle(articleId).subscribe(
      (response: ResponseModel) => {
        this.article = response.responseBody.content;
        this.stepForm.get("articleId").setValue(this.article.id);
        this.steps = this.article.steps;
        this.getStep(this.pageNo);
        this.setValues();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  OnNext(stepForm, isauto = false) {
    if (this.steps.length > 0) {
      this.stepService.editStep(stepForm.value, this.steps[0].id).subscribe(
        () => {
          this.alertify.success("Step updated successfully!");

          this.router.navigate(["/step-edit/", this.articleCode]);
          if (isauto == false) {
            this.getArticle(this.articleCode);
            this.getArticleForNavigation(this.articleCode);
          }
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
          if (isauto == false) {
            this.getArticle(this.articleCode);
            this.getArticleForNavigation(this.articleCode);
          }
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    }
    this.articleService.draftArticle(this.articleCode).subscribe(
      () => {
        this.alertify.success("Article Drafted successfully!");
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  getArticleForNavigation(id: string) {
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

  setValues() {
    if (this.steps.length > 0) {
      this.stepForm.controls["content"].setValue(this.steps[0].content);
      this.stepForm.controls["title"].setValue(this.steps[0].title);
    }
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

  NextStep() {
    this.pageNo += 1;
    this.getStep(this.pageNo);
  }
  previousStep() {
    this.pageNo -= 1;
    this.getStep(this.pageNo);
  }

  DraftArticle(stepForm) {
    stepForm.value["isDraft"] = true;
    if (this.steps.length > 0) {
      this.stepService.editStep(stepForm.value, this.steps[0].id).subscribe(
        () => {
          this.articleService.draftArticle(this.articleCode).subscribe(
            () => {
              this.alertify.success("Article Drafted successfully!");
            },
            (error) => {
              this.alertify.error(error.message);
            }
          );
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
    } else {
      this.stepService.addStep(stepForm.value).subscribe(
        () => {
          this.articleService.draftArticle(this.articleCode).subscribe(
            () => {
              this.alertify.success("Article Drafted successfully!");
            },
            (error) => {
              this.alertify.error(error.message);
            }
          );
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
  }

  AddStep(stepForm) {
    this.newStep = stepForm.value;
    this.newStep.content = "";
    this.newStep.title = "New Episode";
    this.stepService.addStep(this.newStep).subscribe(
      () => {
        // this.getArticleForNavigation(this.articleCode);
        // this.alertify.success("New Step Added!");

        // if (this.article.articleType === 1) {
        //   this.router.navigate([
        //     "/article-view/" + this.articleCode + "/reader/articleReader/",
        //     this.articleCode,
        //   ]);
        // } else {
        //   this.router.navigate([
        //     "/article-view/" + this.articleCode + "/reader/bookReader/",
        //     this.articleCode,
        //   ]);
        // }

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
