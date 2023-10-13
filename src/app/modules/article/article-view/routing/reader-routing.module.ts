import { Routes, RouterModule } from "@angular/router";
import { ArticleReaderComponent } from "../article-reader/article-reader.component";
import { BookReaderComponent } from "../book-reader/book-reader.component";
import { NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { QuillModule } from "ngx-quill";
import { modules } from "src/app/modules/common/utilities/quill.module-constant";

const routes: Routes = [
  { path: "articleReader/:id", component: ArticleReaderComponent },
  { path: "bookReader/:id", component: BookReaderComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    QuillModule.forRoot({ modules: modules }),
  ],
  exports: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ReaderRoutingModule {}
