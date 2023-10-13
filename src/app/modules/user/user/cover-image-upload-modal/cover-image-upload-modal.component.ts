import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResponseModel } from 'src/app/request/response-model';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-cover-image-upload-modal',
  templateUrl: './cover-image-upload-modal.component.html',
  styleUrls: ['./cover-image-upload-modal.component.css']
})
export class CoverImageUploadModalComponent implements OnInit {
  user : any;
  modalRef :BsModalRef;
  constructor(private alertify: AlertifyService, private router : Router,
    private userService: UserService) { 

      

    }

  ngOnInit() {
  }

  getCoverImage(frontPage){
    this.user.coverImage = frontPage;
  }

  upload(){
    const user ={
      id:this.user.id,
      profileImage: this.user.coverImage.url //because of same structure profile image object used in cover also. ToBe changed-- not sure Im Lazy
    }
    
    this.userService.uploadCoverImage(user).subscribe((response: ResponseModel) => {
      this.alertify.success('cover added successfully!');
      this.modalRef.hide();
    }, error => {
      this.alertify.error(error.message);
    });
  }

}
