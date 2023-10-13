import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from 'src/app/_services/catgory/category.service';
import { ResponseModel } from 'src/app/request/response-model';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Category } from 'src/app/_models/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SubCategory } from 'src/app/_models/subcategory';

@Component({
  selector: 'app-subcategory-management-modal',
  templateUrl: './subcategory-management-modal.component.html',
  styleUrls: ['./subcategory-management-modal.component.scss']
})
export class SubcategoryManagementModalComponent implements OnInit {
  
  @Output() updateSelectedSubCategory = new EventEmitter();
  categories : Category[];
  subCategory: SubCategory;
  subcategoryForm: FormGroup
  constructor(private categoryService: CategoryService, private alertify: AlertifyService,
    private fb: FormBuilder,private modalRef : BsModalRef) { }

  ngOnInit() {
    this.subcategoryForm = this.fb.group({
      description: ['', Validators.required],
      categoryId: [''],
      imageType: [''],
      coverImage: [''],
      color:['']
    });
    this.getCategories();
    this.setValues();
  }

  onCategoryChange(id: number){
    
  }
  getCategories(){
    this.categoryService.getCategories().subscribe((response: ResponseModel)=>{
      this.categories = response.responseBody.content;
    }, error=>{
      this.alertify.message(error);
    });
  }

  OnSubmit(event){
    
    this.updateSelectedSubCategory.emit(event);
    this.modalRef.hide();
  }

  setValues(){
    if(this.subCategory === undefined){
    }else{
      this.subcategoryForm.get('description').setValue(this.subCategory.description);
      this.subcategoryForm.get('imageType').setValue(this.subCategory.imageType);
      this.subcategoryForm.get('categoryId').setValue(this.subCategory.categoryId);
      this.subcategoryForm.get('color').setValue(this.subCategory.color);
    }
  }

  getFrontPage(frontPage: string){
    this.subcategoryForm.controls["coverImage"].setValue(frontPage);
    this.subCategory.coverImage = frontPage;
  }

}
