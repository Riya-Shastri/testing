import { Component, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/_services/user.service";
import { ResponseModel } from "src/app/request/response-model";
import { User } from "src/app/_models/user";
import { AdminLoginComponent } from "../../admin/admin-login/admin-login.component";
import { AlertifyService } from "src/app/_services/alertify.service";
import { Follower } from "src/app/_models/follower";
import { UserPhotoUploadModalComponent } from "./user-photo-upload-modal/user-photo-upload-modal.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CoverImageUploadModalComponent } from "./cover-image-upload-modal/cover-image-upload-modal.component";
import { UtilityViewService } from "src/app/_services/common/utility.view.service";
import { NotificationViewService } from "src/app/_services/notification/notification-view.service";
import { SignalRService } from "src/app/_services/notification/signalR.service";
import { ArticleLayourViewService } from "src/app/_services/article/article-layout-view.service";
import { Article } from "src/app/_models/article";
import { ArticleService } from "src/app/_services/article/article.service";
import { CoverType } from "src/app/enums/common.enums";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  userId: any;
  // @Output() user: User;
  lastReadArticles : any = null
  user : any = null
  // @Output() lastReadArticles: Article[];
  Followers: Follower[];
  isFollowed: boolean;
  coverStyle: any;
  isSameUser: boolean;
  currentUser: any = JSON.parse(localStorage.getItem("nameid"));
  modalRef: BsModalRef;
  constructor(
    private params: ActivatedRoute,
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router,
    private modalService: BsModalService,
    private utilityViewService: UtilityViewService,
    route: ActivatedRoute,
    private signalRService: SignalRService,
    private notifcationViewService: NotificationViewService,
    public articleLayoutViewService: ArticleLayourViewService,
    private articleService: ArticleService
  ) {
    route.params.subscribe((val) => {
      // put the code from `ngOnInit` here
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.userId = this.params.snapshot.paramMap.get("id");
    this.getUser(this.userId);
    this.isSameUser = this.utilityViewService.isSameUser(this.userId);
    this.GetLastReadArticle();
  }

  getUser(id: string) {
    this.userService.getUserByName(id).subscribe(
      (response: ResponseModel) => {
        this.user = response.responseBody.content;
        this.Followers = this.user.followers;
        this.loadCoverStyles();
        this.articleLayoutViewService.changeHeaderimage({
          url: this.user.coverImage,
          coverType: CoverType.ProfileCover,
        });
        this.articleLayoutViewService.passUser(this.user);
        if (this.Followers) {
          for (var i = 0; i < this.Followers.length; i++) {
            if (this.Followers[i].followerId == this.currentUser) {
              this.isFollowed = true;
            }
          }
        }
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  followUser() {
    const follower: Follower = {
      userId: this.userId,
      followerId: 0,
    };
    this.userService.addFollower(follower).subscribe(() => {
      this.isFollowed = true;
      this.emitNotificationInfo();
      //this.signalRService.askServer(this.user);
      //this.signalRService.askServerListener();
      this.alertify.success("You have followed " + this.user.firstName);
    });
  }

  emitNotificationInfo(): void {
    this.notifcationViewService.updateCount(true);
  }

  unFollowUser() {
    const follower: Follower = {
      userId: this.userId,
      followerId: 0,
    };
    this.userService.removeFollower(follower).subscribe(
      () => {
        this.isFollowed = false;
        this.alertify.message("You have unfollowed " + this.user.firstName);
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  openPhotoUploadModal() {
    isAdd: Boolean;
    const initialState = {
      user: this.user,
    };
    this.modalRef = this.modalService.show(UserPhotoUploadModalComponent, {
      initialState,
    });
  }

  openCoverUploadModal() {
    isAdd: Boolean;
    const initialState = {
      user: this.user,
    };
    this.modalRef = this.modalService.show(CoverImageUploadModalComponent, {
      initialState,
    });
    this.loadCoverStyles();
  }

  loadCoverStyles() {
    this.coverStyle = {
      "background-image": "url(" + this.user.coverImage + ") !important;",
    };
  }

  GetLastReadArticle() {
    this.articleService.getLastReadArticle(1, 3).subscribe(
      (response: ResponseModel) => {
        this.lastReadArticles = response.responseBody.content;
      },
      (error) => {
        //this.alertify.message(error);
      }
    );
  }
}
