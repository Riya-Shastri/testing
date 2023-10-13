import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BsModalService, ModalModule } from "ngx-bootstrap";
import { BookSidebarComponent } from "src/app/widgets/book-sidebar/book-sidebar.component";
import { SidebarComponent } from "src/app/widgets/sidebar/sidebar.component";
import { ArticleReaderComponent } from "../article-reader/article-reader.component";
import { BookReaderComponent } from "../book-reader/book-reader.component";
import { ReaderRoutingModule } from "../routing/reader-routing.module";
import { QuillModule } from "ngx-quill";
import { modules } from "src/app/modules/common/utilities/quill.module-constant";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormControl,
    ReaderRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    QuillModule.forRoot({ modules: modules }),
  ],
  declarations: [
    BookReaderComponent,
    ArticleReaderComponent,
    SidebarComponent,
    BookSidebarComponent,
  ],
})
export class ReaderModule {}
