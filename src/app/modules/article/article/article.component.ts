import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ArticleService } from "../../../_services/article/article.service";
import { CategoryService } from "../../../_services/catgory/category.service";
import {
  ResponseSearchModel,
  ResponseModel,
} from "../../../request/response-model";
import { AlertifyService } from "../../../_services/alertify.service";
import { BsDropdownConfig } from "ngx-bootstrap/dropdown";
import { Category } from "../../../_models/category";
import { Router } from "@angular/router";
import { Article } from "../../../_models/article";
import { STEP_ITEMS } from "src/app/_constants/article-form";
import { EnumService } from "src/app/_services/common/enum.service";
import { LanguageService } from "src/app/_services/language/language.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ArticleSeriesModalComponent } from "../article-series-modal/article-series-modal.component";

@Component({
  selector: "app-article",
  templateUrl: "./article.component.html",
  styleUrls: ["./article.component.css"],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true },
    },
  ],
})
export class ArticleComponent implements OnInit {
  categories: Category[];
  article: Article;
  articleSeries: any;
  subCategories: any;
  imageType: any;
  parentFrontPage: any;
  articleType: any;
  hasClicked: boolean = false;
  isCheckedSeries: boolean = false;
  //r&d
  formContent: any;
  modalRef: BsModalRef;
  formData: any;
  activeStepIndex: number;
  articleEarnTypes: string[];
  selectedArticleEarnType: number;
  submitted: boolean;
  languages: any;
  articleForm : FormGroup
  
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private enumService: EnumService,
    private alertify: AlertifyService,
    private router: Router,
    private languageService: LanguageService,
    private modalService: BsModalService
  ) {}

  public stepCounter: number = 0;
  public indexer: number = 0;



  get articleFormControl() {
    return this.articleForm.controls;
  }

  ngOnInit() {
    this.articleForm = this.fb.group({
      subcategory: ["", [Validators.required]],
      articleType: ["", [Validators.required]],
      description: ["", [Validators.required]],
      seriesCode: ["", []],
      category: ["", [Validators.required]],
      imageType: ["", [Validators.required]],
      title: ["", Validators.required],
      articleEarnType: ["", Validators.required],
      isDraft: [""],
      minPrice: ["", Validators.required],
      maxPrice: [""],
      languageId: ["", Validators.required],
      // steps:this.fb.array([
      // ])
    });
    this.getCategories();
    this.getArticleEarnType();
    this.formContent = STEP_ITEMS;
    this.formData = {};
    this.getLanguages();
  }

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

  getArticleEarnType() {
    this.enumService.getEnumList(6).subscribe((response: any) => {
      this.articleEarnTypes = response.responseBody.content;
    });
  }

  getSubCategory(id: number) {
    this.categoryService.getSubCategory(id).subscribe(
      (response: ResponseModel) => {
        this.imageType = response.responseBody.content.imageType;
        this.articleForm.controls["imageType"].setValue(this.imageType);
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  onSubCategoryChange(id: number) {
    this.getSubCategory(id);
  }

  onArticleEarnTypeChange(ud: number) {
    this.selectedArticleEarnType = ud;
  }

  onCategoryChange(id: number) {
    this.getSubCategories(id);
  }

  onArticleChange(id: number) {
    this.imageType = id;
    this.articleForm.controls["articleType"].setValue(this.imageType);
  }

  onArticleTypeChange(articleType: number) {
    this.articleType = articleType;
  }
  createSeries() {}
  onArticleSeriesCheck(event: any) {
    console.log(event);
    if (event.checked == true) {
      this.gerArticleSeries();
    } else {
      this.isCheckedSeries = false;
    }
  }

  gerArticleSeries() {
    this.isCheckedSeries = true;
    this.articleService.getUserArticleSeries().subscribe(
      (response: ResponseModel) => {
        this.articleSeries = response.responseBody.content;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  createArticleSeries() {
    var user;
    const initialState = {
      user,
    };
    this.modalRef = this.modalService.show(ArticleSeriesModalComponent, {
      initialState,
    });
    this.modalRef.content.addArticleSeries.subscribe((values) => {
      const articleSeriesForm = {
        seriesTitle: values.value.seriesTitle,
      };
      if (values) {
        this.articleService.addUserArticleSeries(articleSeriesForm).subscribe(
          (response: ResponseModel) => {
            //this.spinner.show();
            this.gerArticleSeries();
            this.alertify.success("Aricle Series added successfully!");
          },
          (error) => {
            this.alertify.error(error.message);
          }
        );
      }
    });
  }

  OnSubmit(articleForm) {
    this.submitted = true;
    this.articleForm.controls["isDraft"].setValue(true);
    this.articleService.addArticle(articleForm.value).subscribe(
      (response: ResponseModel) => {
        this.alertify.success("Article added successfully!");
        this.router.navigate([
          "/article-details-add/",
          response.responseBody.content.articleCode,
        ]);
      },
      (error) => {
        let errorMessage = error.message
          ? error.message
          : "Please enter required fields!";
        this.alertify.error(errorMessage);
      }
    );
  }

  getLanguages() {
    this.languageService.getLanguagesAll().subscribe(
      (response: ResponseModel) => {
        this.languages = response.responseBody.content;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCancel() {
    this.router.navigate(["/userhome"]);
  }

  onFormSubmit(formData: any): void {
    this.formData = formData;

    // post form data here
    alert(JSON.stringify(this.formData));
  }

  hasClickedChange() {
    this.hasClicked = true;
  }
}
