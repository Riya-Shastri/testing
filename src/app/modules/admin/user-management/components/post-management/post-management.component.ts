import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ResponseModel, ResponseSearchModel } from 'src/app/request/response-model';
import { ArticleSearchRequest } from 'src/app/_requestModels/articleSearchRequest';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ArticleService } from 'src/app/_services/article/article.service';
import { ArticleRejectModalComponent } from './article-reject-modal/article-reject-modal.component';

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.css']
})
export class PostManagementComponent implements OnInit {

  articles :any;
  isLoading: boolean;
  currentPageNumber : number = 1;
  isDraft: boolean;
  modalRef: any;
  constructor(private articleService : ArticleService,
    private alertify: AlertifyService, private router : Router,
    private modalService : BsModalService) { }

  ngOnInit() {
    this.loadArticles();
  }

  //get article for admin
  loadArticles() {
    this.isLoading = true;
    const searchQuery: any = {
      Filters: {
        SubCategory: null,
        Title: null,
        Category: null,
        ArticleType: null,
        IsDraft : null
      },
      Paging: {
        PageNo: 1,
        PageSize: 50
      },
      Sorting: [
        {
          ColumnName: 'CreatedDate',
          SortOrder: 'ASC'
        }
      ]
    };

    this.articleService.getArticlesforAdmin(searchQuery).subscribe((response: ResponseSearchModel) => {
      this.articles = response.responseBody.content.entities;

      this.isLoading = false;
    }, error => {
      this.alertify.message(error);

      this.isLoading = false;
    });
  }

  approveArticle(article){
    this.articleService.approveArticle(article.id).subscribe((response: any) => {
      if(response){
        this.alertify.success("Article approved!")
      }
      this.isLoading = false;
    }, error => {
      this.alertify.message(error);

      this.isLoading = false;
    });
  }

  disapproveArticle(article){
    this.articleService.disapproveArticle(article,article.id).subscribe((response: any) => {
      if(response){
        this.alertify.success("Article disapproved!")
      }
      this.isLoading = false;
    }, error => {
      this.alertify.message(error);

      this.isLoading = false;
    });
  }

  addRejectReason(article:any){
    const initialState = {
      article
    }
    
    this.modalRef = this.modalService.show(ArticleRejectModalComponent, {initialState});
    this.modalRef.content.updateSelectedArticle.subscribe((values)=>{
      if(values){
        this.articleService.disapproveArticle(values, article.id).subscribe((response: ResponseModel) => {
          this.disapproveArticle(article);
          this.alertify.success('Article Rejected!');
        }, error => {
          this.alertify.error(error.message);
        });
      }
    })
  }

  viewArticle(){

  }

}
