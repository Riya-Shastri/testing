import { BrowserModule } from "@angular/platform-browser";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalModule, BsModalRef } from "ngx-bootstrap/modal";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ColorSketchModule } from "ngx-color/sketch";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NavComponent } from "./modules/common/nav/nav.component";
import { HomeComponent } from "./modules/common/home/home.component";
import { RegisterComponent } from "./modules/login/register/register.component";
import { LoginComponent } from "./modules/login/login/login.component";
import { UserComponent } from "./modules/user/user/user.component";
import { appRoutes } from "./routes";
import { ArticleListComponent } from "./modules/article/article-list/article-list.component";
import { ArticleComponent } from "./modules/article/article/article.component";
import { FollowerListComponent } from "./modules/user/follower-list/follower-list.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { FormatTitlePipe } from "./_pipes/format-title.pipe";
import { UserListComponent } from "./modules/user/user-list/user-list.component";
import { SiteLayoutComponent } from "./_layouts/site-layout/site-layout.component";
import { NoLayoutComponent } from "./_layouts/no-layout/no-layout.component";
import { AppHeaderComponent } from "./_layouts/app-header/app-header.component";
import { UserHomeComponent } from "./modules/user/user-home/user-home.component";
import { LoggedInAuthGuard } from "./_guards/loggedin.guard";
import { ReaderLayoutComponent } from "./_layouts/reader-layout/reader-layout.component";
import { ArticleViewComponent } from "./modules/article/article-view/article-view.component";
import { StepCreateComponent } from "./modules/article/step-create/step-create.component";
import { ArticleInfoComponent } from "./modules/article/article-info/article-info.component";
import { TokenInterceptorService } from "./_services/token.interceptor";
import { ImageCropperModule } from "ngx-image-cropper";
import { WriterLayoutComponent } from "./_layouts/writer-layout/writer-layout.component";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { QuillModule } from "ngx-quill";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from "angularx-social-login";
import { AdminPanelComponent } from "./modules/admin/admin-panel/admin-panel.component";
import { AdminLayoutComponent } from "./_layouts/admin-layout/admin-layout.component";
import { HasRoleDirective } from "./_directives/hasRole.directive";
import { AdminLoginComponent } from "./modules/admin/admin-login/admin-login.component";
import { RolesManagementModalComponent } from "./modules/admin/user-management/components/roles-management/roles-management-modal/roles-management-modal.component";
import { StepEditComponent } from "./modules/article/step-edit/step-edit.component";
import { PhotoUploaderComponent } from "./modules/common/photo-uploader/photo-uploader.component";
import { FileUploadModule } from "ng2-file-upload";
import { CategoryManagementModalComponent } from "./modules/admin/user-management/components/category-management/category-management-modal/category-management-modal.component";
import { SubcategoryManagementModalComponent } from "./modules/admin/user-management/components/category-management/subcategory-management-modal/subcategory-management-modal.component";
import { StepWriterLayoutComponent } from "./_layouts/step-writer-layout/step-writer-layout.component";
import { BookListComponent } from "./modules/article/book-list/book-list.component";
import { ArticleCommentModalComponent } from "./modules/article/article-info/article-comment-modal/article-comment-modal.component";
import { PasswordResetComponent } from "./modules/common/general/password-reset/password-reset.component";
import { NotFoundComponent } from "./modules/common/general/not-found/not-found.component";
import { UnauthorizedComponent } from "./modules/common/general/unauthorized/unauthorized.component";
import { NotificationComponent } from "./modules/notification/notification/notification.component";
import { CartComponent } from "./modules/cart/cart/cart.component";
import { MainFormsComponent } from "./modules/article/main-forms/main-forms.component";
import { MultistepArticleComponent } from "./modules/article/main-forms/multistep-article/multistep-article.component";
import { MultistepStepComponent } from "./modules/article/main-forms/multistep-step/multistep-step.component";
import { CheckoutComponent } from "./modules/checkout/checkout.component";
import { ArticleEditModalComponent } from "./modules/article/article-edit-modal/article-edit-modal.component";
import { EnterResetcodeComponent } from "./modules/common/general/enter-resetcode/enter-resetcode.component";
import { PasswordRecoveryComponent } from "./modules/common/general/password-recovery/password-recovery.component";
import { CreatorPageComponent } from "./modules/creator-page/creator-page.component";
import { NgxMasonryModule } from "ngx-masonry";
import { UserPhotoUploadModalComponent } from "./modules/user/user/user-photo-upload-modal/user-photo-upload-modal.component";
import { CoverImageUploadModalComponent } from "./modules/user/user/cover-image-upload-modal/cover-image-upload-modal.component";
import { LanguageInterceptor } from "./_services/_interceptors/language.interceptor";
import { ErrorUnauthorizedComponent } from "./modules/common/error-unauthorized/error-unauthorized.component";
import { ErrorNotFoundComponent } from "./modules/common/error-not-found/error-not-found.component";
import { SocialUserComponent } from "./modules/common/general/social-user/social-user.component";
import { ArticleRejectionComponent } from "./modules/article/article-rejection/article-rejection.component";
import { ArticleRejectModalComponent } from "./modules/admin/user-management/components/post-management/article-reject-modal/article-reject-modal.component";
import { ArticleCreateLayoutComponent } from "./_layouts/article-create-layout/article-create-layout.component";
import { ArticleResourceEditComponent } from "./modules/article/article-resource-edit/article-resource-edit.component";
import { CoverLayoutComponent } from "./_layouts/cover-layout/cover-layout.component";
import { UserHomeLayoutComponent } from "./_layouts/user-home-layout/user-home-layout.component";
import { ArticleDetailsAddComponent } from "./modules/article/article/article-resource-steps/article-details-add/article-details-add.component";
import { ArticleFinalizeComponent } from "./modules/article/article/article-resource-steps/article-finalize/article-finalize.component";
import { LoaderComponent } from "./modules/common/loader/loader.component";
import { HomesidebarComponent } from "./widgets/homesidebar/homesidebar.component";
import { OwlModule } from "ngx-owl-carousel";
import { CartHeaderComponent } from "./modules/common/cart-header/cart-header.component";
import { modules } from "./modules/common/utilities/quill.module-constant";
import { ToastrService } from "ngx-toastr";
import { toastrService } from "./modules/common/utilities/toaster.constant";
import { TapToTopComponent } from "./modules/common/tap-to-top/tap-to-top.component";
import { WriterSidebarComponent } from "./widgets/writer-sidebar/writer-sidebar.component";
import { UserSidebarComponent } from "./widgets/user-sidebar/user-sidebar.component";
import { NgxColorsModule } from "ngx-colors";
import {
  RecaptchaModule,
  RecaptchaV3Module,
  RECAPTCHA_V3_SITE_KEY,
} from "ng-recaptcha";
import { ArticleSeriesModalComponent } from "./modules/article/article-series-modal/article-series-modal.component";
import { UserDashboardModule } from "./modules/user/user-dashboard/user-dashboard.module";
import { UserRoutingModule } from "./modules/user/user-dashboard/routing/user-routing.module";
import { ReaderRoutingModule } from "./modules/article/article-view/routing/reader-routing.module";
import { ReaderModule } from "./modules/article/article-view/reader/reader.module";
import { AdminRoutingModule } from "./modules/admin/user-management/routes/admin-routing.module";
import { UserManagementModule } from "./modules/admin/user-management/user-management.module";
import { BookReaderComponent } from "./modules/article/article-view/book-reader/book-reader.component";
import { ArticleReaderComponent } from "./modules/article/article-view/article-reader/article-reader.component";
import { SidebarComponent } from "./widgets/sidebar/sidebar.component";
import { BookSidebarComponent } from "./widgets/book-sidebar/book-sidebar.component";
@NgModule({
    declarations: [
        AppComponent,
        LoaderComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        LoginComponent,
        UserComponent,
        ArticleListComponent,
        ArticleComponent,
        FollowerListComponent,
        FormatTitlePipe,
        UserListComponent,
        SiteLayoutComponent,
        NoLayoutComponent,
        ArticleRejectModalComponent,
        AppHeaderComponent,
        UserHomeComponent,
        ReaderLayoutComponent,
        ArticleViewComponent,
        StepCreateComponent,
        ArticleInfoComponent,
        WriterLayoutComponent,
        AdminPanelComponent,
        AdminLayoutComponent,
        UserPhotoUploadModalComponent,
        HasRoleDirective,
        AdminLoginComponent,
        RolesManagementModalComponent,
        CategoryManagementModalComponent,
        SubcategoryManagementModalComponent,
        StepEditComponent,
        PhotoUploaderComponent,
        StepWriterLayoutComponent,
        BookListComponent,
        ArticleCommentModalComponent,
        PasswordResetComponent,
        NotFoundComponent,
        UnauthorizedComponent,
        NotificationComponent,
        CartComponent,
        MainFormsComponent,
        MultistepArticleComponent,
        MultistepStepComponent,
        CheckoutComponent,
        ArticleEditModalComponent,
        EnterResetcodeComponent,
        PasswordRecoveryComponent,
        CreatorPageComponent,
        CoverImageUploadModalComponent,
        ErrorUnauthorizedComponent,
        ErrorNotFoundComponent,
        SocialUserComponent,
        ArticleRejectionComponent,
        ArticleCreateLayoutComponent,
        ArticleResourceEditComponent,
        CoverLayoutComponent,
        UserHomeLayoutComponent,
        ArticleDetailsAddComponent,
        ArticleFinalizeComponent,
        HomesidebarComponent,
        CartHeaderComponent,
        TapToTopComponent,
        WriterSidebarComponent,
        UserSidebarComponent,
        ArticleSeriesModalComponent,
        BookReaderComponent,
    ArticleReaderComponent,
    SidebarComponent,
    BookSidebarComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, {
            anchorScrolling: "enabled"
        }),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxColorsModule,
        HttpClientModule,
        FontAwesomeModule,
        ImageCropperModule,
        NgxMasonryModule,
        OwlModule,
        BsDropdownModule.forRoot(),
        EditorModule,
        NoopAnimationsModule,
        ModalModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        SocialLoginModule,
        QuillModule.forRoot({ modules: modules }),
        FileUploadModule,
        ColorSketchModule,
        RecaptchaModule,
        RecaptchaV3Module,
        UserDashboardModule,
        UserRoutingModule,
        ReaderRoutingModule,
        // ReaderModule,
        AdminRoutingModule,
        UserManagementModule
    ],
    providers: [
        NoopAnimationsModule,
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: "6LeMi7ojAAAAAELbOXQXSXEBsyCmxKhnBUUqVGAy",
        },
        BsModalRef,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true,
        },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
        { provide: ToastrService, useValue: toastrService },
        {
            provide: "SocialAuthServiceConfig",
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider("286802370442-9mb7223chsh0hb3rt6jkp533kv9f7erh.apps.googleusercontent.com"),
                    },
                ],
            } as SocialAuthServiceConfig,
        },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}

