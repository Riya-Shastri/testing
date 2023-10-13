import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RolesManagementComponent } from "../components/roles-management/roles-management.component";
import { PostManagementComponent } from "../components/post-management/post-management.component";
import { FileManagementComponent } from "../components/file-management/file-management.component";
import { CategoryManagementComponent } from "../components/category-management/category-management.component";
import { SystemReferenceManagementComponent } from "../components/system-reference-management/system-reference-management.component";

const routes: Routes = [
  { path: "rolesManagement", component: RolesManagementComponent },
  { path: "postManagement", component: PostManagementComponent },
  { path: "fileManagement", component: FileManagementComponent },
  { path: "categoryManagement", component: CategoryManagementComponent },
  {
    path: "systemReferenceManagement",
    component: SystemReferenceManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
