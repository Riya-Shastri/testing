import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ResponseModel, ResponseSearchModel } from 'src/app/request/response-model';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin/admin.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RolesManagementModalComponent } from './roles-management-modal/roles-management-modal.component';

@Component({
  selector: 'app-roles-management',
  templateUrl: './roles-management.component.html',
  styleUrls: ['./roles-management.component.css']
})
export class RolesManagementComponent implements OnInit {
  users: User[];
  totalRowCount : any;
  isNext : any;
  isPrevious: any;
  pageNo : number = 1;
  modalRef: BsModalRef;
  constructor(private userService: UserService,private adminService : AdminService, private alertify: AlertifyService
    ,private modalService : BsModalService) { }

  ngOnInit() {
    this.loadUsers(this.pageNo);
  }

  loadUsers(pageNo) {
    const searchQuery: any = {
      Filters: {
        "ArticleId": null
      },
      Paging: {
        PageNo: pageNo,
        PageSize: 10
      },
      Sorting: [
        {
          ColumnName: 'id',
          SortOrder: 'DESC'
        }
      ]
    };

    this.adminService.SearchUsers(searchQuery).subscribe((response: ResponseSearchModel) => {
      this.users = response.responseBody.content.entities;
      this.totalRowCount = response.responseBody.content.pagination.totalRowCount;
      this.isNext = response.responseBody.content.pagination.nextPage;
      this.isPrevious = response.responseBody.content.pagination.previousPage;
    }, error => {
      this.alertify.message(error);
    });
  }

  NextPage() {
    this.pageNo += 1;
    this.loadUsers(this.pageNo);
  }

  previousPage() {
    this.pageNo -= 1;
    this.loadUsers(this.pageNo);
  }

  editUser(user:User){
    const initialState = {
      user,
      roles : this.getRolesArray(user)
    }
    this.modalRef = this.modalService.show(RolesManagementModalComponent, {initialState});
    this.modalRef.content.updateSelectedRoles.subscribe((values)=>{
      const rolesToUpdate = {
        roles: [...values.filter(el=>el.checked === true).map(el=>el.name)]
      }
      if(rolesToUpdate){
        this.adminService.editRoles(user,rolesToUpdate).subscribe(()=>{
          user.userRoles = [...rolesToUpdate.roles];
          this.alertify.success("Roles for user updated!");
        })
      }
    })
  }

  private getRolesArray(user){
    const roles = [];
    const userRoles = user.userRoles.split(',');
    const availableRoles : any[] = [
      {name : 'Admin', value : 'Admin'},
      {name : 'Basic', value : 'Basic'},
      {name : 'Premium', value : 'Premium'},
      {name : 'Moderator', value : 'Moderator'},
      {name : 'Publisher', value : 'Publisher'}
    ];

    for(let i=0;i<availableRoles.length; i++){
      let isMatch = false;
      for(let j = 0; j < userRoles.length; j++){
        if(availableRoles[i].name === userRoles[j]){
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if(!isMatch){
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
}
