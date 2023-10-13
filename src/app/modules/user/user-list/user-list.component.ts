import { Component, OnInit } from '@angular/core';
import { User } from '../../../_models/user';
import { UserService } from '../../../_services/user.service';
import { AlertifyService } from '../../../_services/alertify.service';
import { ResponseModel } from '../../../request/response-model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((response: ResponseModel) => {
      this.users = response.responseBody.content;
    }, error => {
      this.alertify.error(error)
    });
  }
}
