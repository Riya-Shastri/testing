import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ResponseModel } from "src/app/request/response-model";
import { User } from "src/app/_models/user";
import { AlertifyService } from "src/app/_services/alertify.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-user-photo-upload-modal",
  templateUrl: "./user-photo-upload-modal.component.html",
  styleUrls: ["./user-photo-upload-modal.component.css"],
})
export class UserPhotoUploadModalComponent implements OnInit {
  user: User;
  modalRef: BsModalRef;
  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  getProfileImage(frontPage) {
    this.user.profileImage = frontPage;
    this.upload();
  }

  upload() {
    const user = {
      id: this.user.id,
      profileImage: this.user.profileImage.url,
    };
    this.userService.uploadProfileImage(user).subscribe(
      (response: ResponseModel) => {
        this.alertify.success("Updated profile image successfully!");
        localStorage.setItem("userImage", user.profileImage);
        this.modalRef.hide();
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  close() {
    const element =
      this.elementRef.nativeElement.querySelector(".modal-backdrop");
    this.renderer.setStyle(element, "display", "none");
  }
}
