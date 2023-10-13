import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/_models/category';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-category-management-modal',
  templateUrl: './category-management-modal.component.html',
  styleUrls: ['./category-management-modal.component.scss']
})
export class CategoryManagementModalComponent implements OnInit {
  category: Category;
  categoryForm : FormGroup
  @Output() updateSelectedCategory = new EventEmitter();
  constructor(private fb: UntypedFormBuilder,public modalRef : BsModalRef) { }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      description: ['', Validators.required]
    });
  
    this.setValues();
  }


  OnSubmit(event){
    this.updateSelectedCategory.emit(this.categoryForm);
    this.modalRef.hide();
  }

  setValues(){
    if(this.category === undefined){
    }else{
      this.categoryForm.get('description').setValue(this.category.description);
    }
  }
}
