import { Component, OnInit, Input } from '@angular/core';
import { Category } from 'src/app/_models/category';
import { ResponseModel } from 'src/app/request/response-model';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CategoryService } from 'src/app/_services/catgory/category.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryManagementModalComponent } from './category-management-modal/category-management-modal.component';
import { SubCategory } from 'src/app/_models/subcategory';
import { SubcategoryManagementModalComponent } from './subcategory-management-modal/subcategory-management-modal.component';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories : Category[];
  subcategories : SubCategory[];
  category: Category;
  modalRef: BsModalRef;
  selectedCategoryId: number;
  selectedSubCategoryId: number;
  constructor(private categoryService : CategoryService,
    private alertify: AlertifyService, private router : Router,
    private modalService : BsModalService) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories(){
    this.categoryService.getCategories().subscribe((response: ResponseModel)=>{
      this.categories = response.responseBody.content;
    }, error=>{
      this.alertify.message(error);
    });
  }

  getSubcategories(){
    this.categoryService.getSubCategories().subscribe((response: ResponseModel)=>{
      this.subcategories = response.responseBody.content;
    }, error=>{
      this.alertify.message(error);
    });
  }

  editCategory(category:any){
    const initialState = {
      category
    }
    this.selectedCategoryId = category.id;
    this.modalRef = this.modalService.show(CategoryManagementModalComponent, {initialState});
    this.modalRef.content.updateSelectedCategory.subscribe((values)=>{
      
      if(values){
        this.categoryService.editCategory(values.value, category.id).subscribe((response: ResponseModel) => {
          this.alertify.success('Category editted successfully!');
          this.getCategories();
        }, error => {
          this.alertify.error(error.message);
        });
      }
    })
  }

  AddCategory(category: any){
    isAdd: Boolean;
    const initialState = {
      category
    }
    
    this.modalRef = this.modalService.show(CategoryManagementModalComponent, {initialState});
    this.modalRef.content.updateSelectedCategory.subscribe((values)=>{
      
      if(values){
        this.categoryService.addCategory(values.value).subscribe((response: ResponseModel) => {
          this.alertify.success('Category added successfully!');
          this.getCategories();
        }, error => {
          this.alertify.error(error.message);
        });
      }
    })
  }

  editSubCategory(subCategory:any){
    const initialState = {
      subCategory
    }
    this.selectedSubCategoryId = subCategory.id;
    this.modalRef = this.modalService.show(SubcategoryManagementModalComponent, {initialState});
    this.modalRef.content.updateSelectedSubCategory.subscribe((values)=>{
      const subCategoryDto = {
        description: values.value.description,
        imageType: values.value.imageType,
        categoryId: values.value.categoryId,
        coverImage: values.value.coverImage.url,
        relativePath: values.value.coverImage.relativeUrl,
        color: values.value.color
      } as SubCategory
      if(values){
        this.categoryService.editSubCategory(subCategoryDto, subCategory.id).subscribe((response: ResponseModel) => {
          this.alertify.success('Sub Category editted successfully!');
          this.getSubcategories();
          this.getCategories();
        }, error => {
          this.alertify.error(error.message);
        });
      }
    })
  }

  AddSubCategory(category: any){
    isAdd: Boolean;
    
    if(!category){
      category = {} as SubCategory;
    }
    const initialState = {
      category
    }
    this.modalRef = this.modalService.show(SubcategoryManagementModalComponent, {initialState});
    this.modalRef.content.updateSelectedSubCategory.subscribe((values)=>{
      if(values){
        this.categoryService.addSubCategory(values.value).subscribe((response: ResponseModel) => {
          this.alertify.success('Sub Category added successfully!');
          this.getSubcategories();
          this.getCategories();
        }, error => {
          this.alertify.error(error.message);
        });
      }
    })
  }

  InitiateSubCategoryModal(){
    this.getSubcategories();
  }

  getImageTypeValue(imageType:number){
    switch(imageType){
      case 1:
        return 'Fiction';
      case 2:
        return 'Novel';
      case 3:
        return 'Article';
      case 4:
        return 'Children';
    }
  }
}
