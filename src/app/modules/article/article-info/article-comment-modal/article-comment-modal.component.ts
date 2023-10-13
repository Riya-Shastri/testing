import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResponseModel, ResponseSearchModel } from 'src/app/request/response-model';
import { Comments } from 'src/app/_models/comments';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ArticleService } from 'src/app/_services/article/article.service';

@Component({
  selector: 'app-article-comment-modal',
  templateUrl: './article-comment-modal.component.html',
  styleUrls: ['./article-comment-modal.component.css']
})
export class ArticleCommentModalComponent implements OnInit {
  @Output() addComment = new EventEmitter();
  articleId : any;
  isLoggedIn : boolean;
  countComments: number;
  comments: Array<Comments> = [];
  commentForm : FormGroup
  
  constructor(private fb: FormBuilder,
    public modalRef : BsModalRef, private articleService: ArticleService, 
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
    this.loadComments();
  }


  OnSubmit(event){
    this.addComments();
  }

  loadComments(){
    const searchQuery: any = {
      Filters: {
        ArticleId: this.articleId
      },
      Paging: {
        PageNo: 1,
        PageSize: 10
      },
      Sorting: [
        {
          ColumnName: 'CreatedDate',
          SortOrder: 'DESC'
        }
      ]
    };

    this.articleService.getComments(searchQuery).subscribe((response: ResponseSearchModel) => {
      this.countComments = response.responseBody.content.pagination.totalRowCount;
        for(var i = 0; i <= response.responseBody.content.entities.length - 1; i++){
          this.comments.push(response.responseBody.content.entities[i]);
        }
      
    }, error => {
      this.alertify.message(error);
    });
  }

  addComments(){
    const commentDto = {
      comment: this.commentForm.value["comment"],
      articleId: this.articleId
    }
      this.articleService.addComment(commentDto).subscribe((response: ResponseModel) => {
        //this.spinner.show();
        this.comments.unshift(response.responseBody.content);
        this.alertify.success('Comment added successfully!');
      }, error => {
        this.alertify.error(error.message);
      });
      
  }

}
