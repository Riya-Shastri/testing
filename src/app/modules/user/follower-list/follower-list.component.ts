import { Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/app/request/response-model';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-follower-list',
  templateUrl: './follower-list.component.html',
  styleUrls: ['./follower-list.component.css']
})
export class FollowerListComponent implements OnInit {

  users: User[];
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadFollowers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((response: ResponseModel) => {
      this.users = response.responseBody.content;
    }, error => {
      this.alertify.error(error)
    });
  }

  loadFollowers() {
    const searchQuery: any = {
      Filters: {
        FullName: '',
        Role: '',
        UserId: ''
      },
      Paging: {
        PageNo: 1,
        PageSize: 50
      },
      Sorting: [
        {
          ColumnName: 'Value',
          SortOrder: 'ASC'
        }
      ]
    };
    this.userService.getFollowings(searchQuery).subscribe((response: ResponseModel) => {
      this.users = response.responseBody.content.entities;
    }, error => {
      this.alertify.error(error)
    });
  }

}
