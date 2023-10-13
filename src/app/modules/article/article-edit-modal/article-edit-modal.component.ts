import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResponseModel } from 'src/app/request/response-model';
import { STEP_ITEMS } from 'src/app/_constants/article-form';
import { Article } from 'src/app/_models/article';
import { Category } from 'src/app/_models/category';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ArticleService } from 'src/app/_services/article/article.service';
import { CategoryService } from 'src/app/_services/catgory/category.service';

@Component({
  selector: 'app-article-edit-modal',
  templateUrl: './article-edit-modal.component.html',
  styleUrls: ['./article-edit-modal.component.css']
})
export class ArticleEditModalComponent implements OnInit {
  @Output() editArticle = new EventEmitter();
  categories : Category[];
  article : Article;
  subCategories: any;
  imageType:any;
  parentFrontPage: any;
  articleType:any;

  //r&d
  formContent: any;
  formData: any;
  activeStepIndex: number;
  articleForm: FormGroup
  constructor(private fb: FormBuilder, private articleService : ArticleService, private categoryService : CategoryService,
     private alertify: AlertifyService, private router : Router, public modalRef : BsModalRef) { }

  public stepCounter:number = 0;
  public indexer : number = 0;

  
  ngOnInit() {
    this.articleForm = this.fb.group({
      subCategory: ['', [Validators.required]],
      articleType: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      imageType: ['', [Validators.required]],
      minPrice: ['', [Validators.required]],
      maxPrice: [''],
      isbn1: [''],
      frontPage: [''],
      title: ['', Validators.required],
      // steps:this.fb.array([
      // ])
    });
    this.getCategories();
    this.formContent = STEP_ITEMS;
    this.setValues(this.article);
    this.formData = {};
  }

  setValues(article: any){
    this.articleForm.controls["title"].setValue(article.title);
    this.articleForm.controls["subCategory"].setValue(article.subCategoryId);
    this.articleForm.controls["description"].setValue(article.description);
    this.articleForm.controls["frontPage"].setValue(article.frontPage);
    this.articleForm.controls["articleType"].setValue(article.articleType);
    this.articleForm.controls["isbn1"].setValue(article.isbn1);
    this.articleForm.controls["minPrice"].setValue(article.minPrice);
    this.articleForm.controls["maxPrice"].setValue(article.maxPrice);

    this.getSubCategory(article.subCategoryId);

    this.articleForm.controls["imageType"].setValue(article.imageType);
    this.articleForm.controls["category"].setValue(article.categoryId);
  }

  getFrontPage(frontPage: string){
    this.articleForm.controls["frontPage"].setValue(frontPage);
    this.article.frontPage = frontPage;
  }

  getSubCategories(id: number){
    this.categoryService.getSubCategoryByCategory(id).subscribe((response: ResponseModel)=>{
      this.subCategories = response.responseBody.content;
    }, error=>{
      this.alertify.message(error);
    });
  }

  getCategories(){
    this.categoryService.getCategories().subscribe((response: ResponseModel)=>{
      this.categories = response.responseBody.content;
      this.getSubCategories(this.article.categoryId);
    }, error=>{
      this.alertify.message(error);
    });
  }


  getSubCategory(id: number){
    this.categoryService.getSubCategory(id).subscribe((response: ResponseModel)=>{
      this.imageType = response.responseBody.content.imageType;
      this.articleForm.controls["imageType"].setValue(this.imageType);
    }, error=>{
      this.alertify.message(error);
    });
  }


  onSubCategoryChange(id: number){
    this.getSubCategory(id);
  }


  onCategoryChange(id: number){
    this.getSubCategories(id);
  }

  onArticleChange(id: number){
    this.imageType = id
    this.articleForm.controls["articleType"].setValue(this.imageType);
  }

  onArticleTypeChange(articleType: number){
    this.articleType = articleType;
  }

  OnSubmit(){
    this.editArticle.emit(this.articleForm);
    this.modalRef.hide();
  }

  onFormSubmit(formData: any): void {
    this.formData = formData;

    // post form data here
  }

}
