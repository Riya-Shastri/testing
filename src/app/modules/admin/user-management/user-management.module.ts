import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesManagementComponent } from './components/roles-management/roles-management.component';
import { AdminRoutingModule } from './routes/admin-routing.module';
import { PostManagementComponent } from './components/post-management/post-management.component';
import { FileManagementComponent } from './components/file-management/file-management.component';
import { RolesManagementModalComponent } from './components/roles-management/roles-management-modal/roles-management-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { ArticleRejectModalComponent } from './components/post-management/article-reject-modal/article-reject-modal.component';
import { ArticleRejectionComponent } from '../../article/article-rejection/article-rejection.component';
import { SystemReferenceManagementComponent } from './components/system-reference-management/system-reference-management.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RolesManagementComponent, PostManagementComponent, FileManagementComponent, CategoryManagementComponent, SystemReferenceManagementComponent],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class UserManagementModule { }
