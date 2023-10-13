import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models/user';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles-management-modal',
  templateUrl: './roles-management-modal.component.html',
  styleUrls: ['./roles-management-modal.component.css']
})
export class RolesManagementModalComponent implements OnInit {
  
  @Output() updateSelectedRoles = new EventEmitter();
  user: User;
  closeBtnName: string;
  list : any[] = [];
  roles: any;
  constructor(public modalRef : BsModalRef, private fb: FormBuilder) { }

  ngOnInit() {
  }

  rolesForm = this.fb.group({
    articleId: ['', Validators.required],
    content: ['', Validators.required],
    title: ['', Validators.required]
  });

  updateRoles(){
    this.updateSelectedRoles.emit(this.roles);
    this.modalRef.hide();
  }

  OnSubmit(event){

  }

}
