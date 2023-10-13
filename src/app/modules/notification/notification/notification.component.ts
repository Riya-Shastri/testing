import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/_services/notification/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any;
  notificationCount: number;
  pageCount:number = 1;
  pageSize: number = 10;
  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(){
    
    const searchQuery: any = {
      Filters: {
        userId: null,
        CreatedDate: null,
        notificationUserId: null,
        isViewed: null

      },
      Paging: {
        PageNo: this.pageCount,
        PageSize: this.pageSize
      },
      Sorting: [
        {
          ColumnName: 'CreatedOn',
          SortOrder: 'DESC'
        }
      ]
    };

    this.notificationService.getNotificationList(searchQuery).subscribe((response: any) => {
      this.notifications = response.responseBody.content.entities;
      this.notificationCount = this.notifications.length;
    }, error => {
    });
  }

}
