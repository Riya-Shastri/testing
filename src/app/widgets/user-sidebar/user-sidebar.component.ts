import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserPhotoUploadModalComponent } from 'src/app/modules/user/user/user-photo-upload-modal/user-photo-upload-modal.component';
import { Article } from 'src/app/_models/article';
import { Follower } from 'src/app/_models/follower';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UtilityViewService } from 'src/app/_services/common/utility.view.service';
import { NotificationViewService } from 'src/app/_services/notification/notification-view.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss']
})

export class UserSidebarComponent implements OnInit {
  
  @Input() user: User;
  isFollowed:boolean;
  userId:number;
  isSameUser: boolean;
  modalRef :BsModalRef;
  @Input() lastReadArticles: Article[];

  constructor(private userService: UserService, 
    private alertify: AlertifyService,
     private notifcationViewService: NotificationViewService,
     private utilityViewService : UtilityViewService,
    private modalService : BsModalService) { }

  ngOnInit(): void {
    
    this.isSameUser = this.utilityViewService.isSameUser(this.userId);
  }

  followUser(){
    const follower: Follower = {
      userId : this.userId,
      followerId: this.user.id
    };
    this.userService.addFollower(follower).subscribe(() => {
      this.isFollowed = true;
      this.emitNotificationInfo();
      //this.signalRService.askServer(this.user);
      //this.signalRService.askServerListener();
      this.alertify.success("You have followed "+ this.user.firstName);
    });
  }

  
  emitNotificationInfo(): void{
    this.notifcationViewService.updateCount(true);
  }

  unFollowUser(){
    const follower: Follower = {
      userId : this.userId,
      followerId: 0
    };
    this.userService.removeFollower(follower).subscribe(() => {
      this.isFollowed = false;
      this.alertify.message("You have unfollowed "+ this.user.firstName);
    }, error => {
      this.alertify.message(error);
    });
  }

  rateUser(){

  }

  openPhotoUploadModal(){
    isAdd: Boolean;
    const initialState = {
      user: this.user
    } as unknown as User
    this.modalRef = this.modalService.show(UserPhotoUploadModalComponent, {initialState});
}

}
