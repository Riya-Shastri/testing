import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Photo } from "src/app/_models/photo";
import { FileUploader } from "ng2-file-upload";
import { environment } from "src/environments/environment";
import {
  ResponseModel,
  ResponseSearchModel,
} from "src/app/request/response-model";
import { getJSDocThisTag, isConstructSignatureDeclaration } from "typescript";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { UtilityService } from "src/app/_services/utility/utility.service";
import { UploadService } from "src/app/_services/utility/upload.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { FileUpload } from "src/app/_models/fileUpload";
import { SubCategory } from "src/app/_models/subcategory";

@Component({
  selector: "app-photo-uploader",
  templateUrl: "./photo-uploader.component.html",
  styleUrls: ["./photo-uploader.component.css"],
})
export class PhotoUploaderComponent implements OnInit, OnChanges {
  @Input() photos: any;
  @Input() article: any;
  @Input() subCategory: SubCategory;
  @Input() parentFormData: any;
  @Input() userForProfile: any;
  @Input() userForCover: any;
  @Input() typeChange: any;
  @Output() setFrontPage = new EventEmitter<object>();
  @Output() setProfileImage = new EventEmitter<object>();
  @Output() setCoverImage = new EventEmitter<object>();
  uploader: FileUploader;
  imageChangedEvent: any = "";
  croppedImage: any = "";

  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  baseUrl = environment.baseUrl;
  response: any;
  ifArticle: boolean = false;
  imageAttached: boolean;
  selectedRatio: any;
  public uploadRequest = {} as FileUpload;

  constructor(
    private uploadService: UploadService,
    private alertify: AlertifyService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit() {
    if (this.subCategory) {
      this.selectedRatio = 2.5;
      this.ifArticle = false;
    } else {
      if (this.userForProfile) {
        this.selectedRatio = 1;
        this.ifArticle = false;
      } else if (this.userForCover) {
        this.selectedRatio = 4.2;
        this.ifArticle = false;
      } else {
        if (this.article) {
          if (this.article.articleType == 1) {
            this.ifArticle = true;
            this.selectedRatio = 2.5;
          } else {
            this.ifArticle = false;
            this.selectedRatio = 0.6666666;
          }
        } else {
          this.selectedRatio = 2.5;
          this.ifArticle = false;
        }
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    if (event) {
      this.imageAttached = true;
    }
  }

  imageCropped(event) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  finishCrop() {
    //upload image
    const uploadobj = {};
    this.uploadRequest.file = this.croppedImage;

    if (this.subCategory) {
      this.uploadRequest.title = this.subCategory.description;
    }

    if (this.article) {
      this.uploadRequest.title = this.article.title;
      this.uploadRequest.id = this.article.id;
    }

    if (this.userForProfile) {
      this.uploadRequest.title = this.userForProfile.userName;
      this.uploadRequest.imageType = 5;
      this.uploadRequest.id = this.userForProfile.id;
    }

    if (this.userForCover) {
      this.uploadRequest.title = this.userForCover.userName;
      this.uploadRequest.imageType = 6;
      this.uploadRequest.id = this.userForCover.id;
    }

    this.uploadService.uploadFile(this.uploadRequest).subscribe(
      (response: any) => {
        this.response = response.responseBody.content;
        if (this.userForCover || this.subCategory) {
          this.setCoverImage.emit(response.responseBody.content);
        } else if (this.userForProfile) {
          this.setProfileImage.emit(response.responseBody.content);
        } else {
          this.uploadRequest.articleType = parseInt(this.article.articleType);
          this.setFrontPage.emit(response.responseBody.content);
        }
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  generateGuid() {
    var result, i, j;
    result = "";
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
      i = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
      result = result + i;
    }
    return result;
  }
}
