import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ArticleService } from '../../../_services/article/article.service';
import { ResponseModel, ResponseSearchModel } from '../../../request/response-model';
import { AlertifyService } from '../../../_services/alertify.service';
import { ActivatedRoute } from "@angular/router";
import { Step } from '../../../_models/step';
import { Article } from '../../../_models/article';
import { StepService } from '../../../_services/step/step.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilityService } from 'src/app/_services/utility/utility.service';
import * as Quill from '../../../../../node_modules/quill/dist/quill.min';
import { Validators, FormBuilder } from '@angular/forms';
import { Highlight } from 'src/app/_models/highlight';
import { HighlightAdd } from 'src/app/request/step/step.edit';
import { Input } from '@angular/core';
import { ArticleViewService } from 'src/app/_services/article/article-view.service';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.css']
})
export class ArticleViewComponent implements OnInit {
  articleId:any;
  @Input() steps: Step[];
  @Input() article: Article;
 

  constructor(private fb: FormBuilder,private articleService: ArticleService, private alertify: AlertifyService,
    private params: ActivatedRoute,  private stepService: StepService, private articleViewService: ArticleViewService) { 
    
    }

    stepReadForm = this.fb.group({
      content: ['', Validators.required]
    });
  
  ngOnInit() {
    this.articleId = this.params.snapshot.paramMap.get('id');
    

  }

  getArticle(id: number) {
    this.articleService.getArticle(id).subscribe((response: ResponseModel) => {
      this.article = response.responseBody.content;
      
    }, error => {
      this.alertify.message(error);
    });
  }

}
