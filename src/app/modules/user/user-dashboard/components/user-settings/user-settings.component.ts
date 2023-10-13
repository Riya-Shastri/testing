import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertifyService } from "src/app/_services/alertify.service";
import { ArticleService } from "src/app/_services/article/article.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "src/app/_services/user.service";
import { ResponseModel } from "src/app/request/response-model";
import { CommonService } from "src/app/_services/utility/common.service";
import { UtilityViewService } from "src/app/_services/common/utility.view.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { LanguageService } from "src/app/_services/language/language.service";
import { debug } from "console";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"],
})
export class UserSettingsComponent implements OnInit {
  user: any;
  userId: any;
  languages: any;
  preferredLanguage: string;
  userSettingsForm: FormGroup
  userLanguages = [];
  selectedItems = [];
  selectedLanguages = [];
  requestObj: any;
  dropdownSettings: IDropdownSettings = {};
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router,
    private params: ActivatedRoute,
    private commonService: CommonService,
    private utilityViewService: UtilityViewService,
    private languageService: LanguageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "Unselect All",
      itemsShowLimit: 10,
      allowSearchFilter: true,
    };
    this.userSettingsForm = this.fb.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required]],
      preferredLanguage: ["", [Validators.required]],
      languages: [""],
      selectedItems: [this.selectedItems],
      // steps:this.fb.array([
      // ])
    });
  }


  onItemSelect(event) {
    this.selectedLanguages.push(event.item_id);
  }

  ngOnInit() {
    this.getLanguages();
    this.getUserLanguages();
    this.userId = parseInt(this.params.snapshot.paramMap.get("id"));
    this.getUser(this.userId);
    if (!this.utilityViewService.isSameUser(this.userId)) {
      this.router.navigate(["/unauthorized"]);
    }
    this.changeDetectorRef.detectChanges();
  }
  onSelectAll(event) {}
  selectedItemsChanged() {
    // TODO document why this method 'selectedItemsChanged' is empty
    //this.setValues();
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(
      (response: ResponseModel) => {
        this.user = response.responseBody.content;
        this.selectedItems = this.user.languages;
        this.selectedLanguages = this.user.languages.map(
          (item) => item.item_id
        );
        this.setValues();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  onItemDeSelect(event) {
    const index = this.selectedLanguages.indexOf(event.item_id); // Find the index of the item you want to remove
    if (index !== -1) {
      this.selectedLanguages.splice(index, 1); // Remove the item at the index
    }
  }

  setValues() {
    this.userSettingsForm.controls["username"].setValue(this.user.userName);
    this.userSettingsForm.controls["email"].setValue(this.user.email);
    this.userSettingsForm.controls["preferredLanguage"].setValue(
      this.user.preferredLanguage
    );
    this.userSettingsForm.controls["languages"].setValue(this.selectedItems);
    this.userSettingsForm.controls["selectedItems"].setValue(
      this.selectedItems
    );
  }
  OnSubmit(userSettingsForm) {
    this.requestObj = this.userSettingsForm;
    this.requestObj.controls["languages"].setValue(this.selectedLanguages);
    this.userService.editUser(this.requestObj.value, this.user.id).subscribe(
      (response: ResponseModel) => {
        this.getUser(this.userId);
        this.user = response.responseBody.content;
        localStorage.setItem(
          "preferredLanguage",
          this.commonService.GetLanguageString(
            parseInt(this.user.preferredLanguage)
          )
        );
        this.setValues();
        this.alertify.success("Updated sucessfully!");
        location.reload();
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  checkIfExist() {}

  getLanguages() {
    //2 = languages
    this.commonService.GetEnums(2).subscribe(
      (response: ResponseModel) => {
        this.languages = response.responseBody.content;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  getUserLanguages() {
    //2 = languages
    this.languageService.getLanguages().subscribe(
      (response: ResponseModel) => {
        this.userLanguages = response.responseBody.content;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }

  onLanguageChange(language: any) {
    this.userSettingsForm.controls["languages"].setValue(language);
  }
}
