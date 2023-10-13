import { Routes } from "@angular/router";
import { HomeComponent } from "./modules/common/home/home.component";
import { UserComponent } from "./modules/user/user/user.component";
import { AuthGuard } from "./_guards/auth.guard";
import { LoginComponent } from "./modules/login/login/login.component";
import { ArticleListComponent } from "./modules/article/article-list/article-list.component";
import { ArticleComponent } from "./modules/article/article/article.component";
import { FollowerListComponent } from "./modules/user/follower-list/follower-list.component";
import { UserListComponent } from "./modules/user/user-list/user-list.component";
import { RegisterComponent } from "./modules/login/register/register.component";
import { SiteLayoutComponent } from "./_layouts/site-layout/site-layout.component";
import { NoLayoutComponent } from "./_layouts/no-layout/no-layout.component";
import { UserHomeComponent } from "./modules/user/user-home/user-home.component";
import { LoggedInAuthGuard } from "./_guards/loggedin.guard";
import { ReaderLayoutComponent } from "./_layouts/reader-layout/reader-layout.component";
import { StepCreateComponent } from "./modules/article/step-create/step-create.component";
import { ArticleViewComponent } from "./modules/article/article-view/article-view.component";
import { ArticleInfoComponent } from "./modules/article/article-info/article-info.component";
import { WriterLayoutComponent } from "./_layouts/writer-layout/writer-layout.component";
import { AdminLayoutComponent } from "./_layouts/admin-layout/admin-layout.component";
import { AdminPanelComponent } from "./modules/admin/admin-panel/admin-panel.component";
import { StepEditComponent } from "./modules/article/step-edit/step-edit.component";
import { StepWriterLayoutComponent } from "./_layouts/step-writer-layout/step-writer-layout.component";
import { BookListComponent } from "./modules/article/book-list/book-list.component";
import { CartComponent } from "./modules/cart/cart/cart.component";
import { NotificationComponent } from "./modules/notification/notification/notification.component";
import { PasswordResetComponent } from "./modules/common/general/password-reset/password-reset.component";
import { EnterResetcodeComponent } from "./modules/common/general/enter-resetcode/enter-resetcode.component";
import { PasswordRecoveryComponent } from "./modules/common/general/password-recovery/password-recovery.component";
import { CreatorPageComponent } from "./modules/creator-page/creator-page.component";
import { NoAuthGuard } from "./_guards/no.guard";
import { ErrorUnauthorizedComponent } from "./modules/common/error-unauthorized/error-unauthorized.component";
import { SocialUserComponent } from "./modules/common/general/social-user/social-user.component";
import { ArticleRejectionComponent } from "./modules/article/article-rejection/article-rejection.component";
import { ArticleCreateLayoutComponent } from "./_layouts/article-create-layout/article-create-layout.component";
import { ArticleResourceEditComponent } from "./modules/article/article-resource-edit/article-resource-edit.component";
import { CoverLayoutComponent } from "./_layouts/cover-layout/cover-layout.component";
import { UserHomeLayoutComponent } from "./_layouts/user-home-layout/user-home-layout.component";
import { ArticleDetailsAddComponent } from "./modules/article/article/article-resource-steps/article-details-add/article-details-add.component";
import { ArticleFinalizeComponent } from "./modules/article/article/article-resource-steps/article-finalize/article-finalize.component";
import { ErrorNotFoundComponent } from "./modules/common/error-not-found/error-not-found.component";

export const appRoutes: Routes = [
  {
    path: "",
    runGuardsAndResolvers: "always",
    component: CoverLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "user/:id",
        component: UserComponent,
        children: [
          {
            path: "settings",
            loadChildren: () =>
              import(
                "./modules/user/user-dashboard/user-dashboard.module"
              ).then((m) => m.UserDashboardModule),
          },
        ],
      },
      { path: "follower-list", component: FollowerListComponent },
      { path: "user-list", component: UserListComponent },
      { path: "logout", component: LoginComponent },
      { path: "unauthorized", component: ErrorUnauthorizedComponent },
      { path: "notFound", component: ErrorNotFoundComponent },
      { path: "article-info/:id", component: ArticleInfoComponent },
    ],
  },
  {
    path: "",
    component: CoverLayoutComponent,
    children: [
      { path: "article-rejection/:id", component: ArticleRejectionComponent },
      { path: "book-list", component: BookListComponent },
    ],
  },
  {
    path: "",
    component: CoverLayoutComponent,
    children: [
      { path: "article-list", component: ArticleListComponent },
      { path: "article-list/:id", component: ArticleListComponent },
      { path: "article-list/sub/:id", component: ArticleListComponent },
    ],
  },
  {
    path: "",
    component: NoLayoutComponent,
    canActivate: [LoggedInAuthGuard],
    children: [
      { path: "home", component: HomeComponent },
      { path: "login", component: LoginComponent },
      { path: "register", component: RegisterComponent },
      { path: "userinfo", component: SocialUserComponent },
      { path: "password-reset", component: PasswordResetComponent },
      { path: "enter-resetcode", component: EnterResetcodeComponent },
      { path: "password-recovery", component: PasswordRecoveryComponent },
    ],
  },
  {
    path: "",
    component: NoLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [
      { path: "thilanka.ranasinghe", component: CreatorPageComponent },
    ],
  },
  {
    path: "",
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: "userhome", component: UserHomeComponent }],
  },
  {
    path: "",
    component: CoverLayoutComponent,
    children: [
      {
        path: "article-view",
        component: ArticleViewComponent,
        children: [
          {
            path: "reader",
            //loadChildren: './modules/user/user-dashboard/user-dashboard.module#UserDashboardModule'
            loadChildren: () =>
              import(
                "./modules/article/article-view/reader/reader.module"
              ).then((m) => m.ReaderModule),
          },
        ],
      },
    ],
    // [
    //    { path: 'step-create/:articleId', component: StepCreateComponent },
    //    { path: 'step-edit/:articleId', component: StepEditComponent },
    //    { path: 'article-view/:id', component: ArticleViewComponent },
    // ]
  },

  {
    path: "",
    component: CoverLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "step-create/:articleId", component: StepCreateComponent },
      { path: "step-edit/:articleId", component: StepEditComponent },
    ],
  },

  {
    path: "",
    component: CoverLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "cart", component: CartComponent },
      { path: "notifications", component: NotificationComponent },
    ],
  },

  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "admin",
        component: AdminPanelComponent,
        data: {
          roles: ["Admin", "Moderator"],
        },
        children: [
          {
            path: "management",
            loadChildren: () =>
              import(
                "./modules/admin/user-management/user-management.module"
              ).then((m) => m.UserManagementModule),
          },
        ],
      },
    ],
  },
  {
    path: "",
    component: CoverLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "article", component: ArticleComponent },
      { path: "article-resource", component: ArticleResourceEditComponent },
      { path: "article-details", component: ArticleDetailsAddComponent },
      { path: "article-finalize", component: ArticleFinalizeComponent },
      {
        path: "article-details-add/:articleId",
        component: ArticleDetailsAddComponent,
      },
    ],
  },

  { path: "**", redirectTo: "notFound", pathMatch: "full" },
];
