import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseModel, ResponseSearchModel } from 'src/app/request/response-model';
import { HighlightAdd } from 'src/app/request/step/step.edit';
import { Article } from 'src/app/_models/article';
import { Step } from 'src/app/_models/step';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ArticleViewService } from 'src/app/_services/article/article-view.service';
import { ArticleService } from 'src/app/_services/article/article.service';
import { UtilityViewService } from 'src/app/_services/common/utility.view.service';
import { StepService } from 'src/app/_services/step/step.service';

@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.scss']
})
export class BookReaderComponent implements OnInit {

  article: Article;
  articleId: any;
  steps: Step[];
  stepsForNav: Step[];
  articleForNav: Article;
  pageNo: number = 1;
  totalRowCount: number;
  public href: string = "";
  isNext: boolean;
  isPrevious: boolean = false;
  isBook: boolean = false;
  userId: number;
  currentUser: any;
  isAdmin: boolean;
  isSameUser: boolean;
  isLoggedIn: boolean;
  content: any;
  highlitedText: any;
  isReadCounted: boolean = false;
  subscription: Subscription;
  @Input() StepIdFromNav: number;
  @ViewChild('editor') editor: ElementRef;

  constructor(private fb: FormBuilder, private articleService: ArticleService, private alertify: AlertifyService,
    private params: ActivatedRoute, private router: Router,
    private utilityViewService: UtilityViewService, private stepService: StepService, private articleViewService: ArticleViewService) {


  }

  stepReadForm = this.fb.group({
    content: ['', Validators.required]
  });

  ngOnInit() {
    this.articleId = this.params.snapshot.paramMap.get('id');
    this.getStep(this.pageNo);
    this.getArticle(this.articleId);
    this.href = location.pathname;
    this.currentUser = sessionStorage.getItem('id');
    this.isLoggedIn = this.utilityViewService.isLoggedIn();
    if (this.isLoggedIn) {
      this.isSameUser = this.utilityViewService.isSameUser(this.userId);
      this.isAdmin = this.utilityViewService.isAdminUser();
    }
    this.subscription = this.articleViewService.listen().subscribe((m: any) => {
      this.getStep(m);
      this.pageNo = m;
    })
  }

  emitArticleInfo(): void {
    this.articleViewService.passArticle(this.articleForNav);
  }

  getArticle(id: number) {
    this.articleService.getArticle(id).subscribe((response: ResponseModel) => {
      this.article = response.responseBody.content;
      this.userId = response.responseBody.content.userId;
      this.isSameUser = this.utilityViewService.isSameUser(this.userId);
    }, error => {
      this.alertify.message(error);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  setValues() {
    this.stepReadForm.controls["content"].setValue(this.content);
  }

  getArticleForNavigation(id: number, stepId: number) {
    this.articleService.getArticleForNavigationWithStepId(id, stepId).subscribe((response: ResponseModel) => {
      this.articleForNav = response.responseBody.content;
      this.stepsForNav = this.articleForNav.steps;
      this.isBook = response.responseBody.content.articleType === 2 ? true : false;
      this.emitArticleInfo();
    }, error => {
      this.alertify.message(error);
    });
  }

  getStep(pageNo) {
    const searchQuery: any = {
      Filters: {
        "ArticleId": this.articleId.toString()
      },
      Paging: {
        PageNo: pageNo,
        PageSize: 1
      },
      Sorting: [
        {
          ColumnName: 'id',
          SortOrder: 'ASC'
        }
      ]
    };

    this.stepService.getSteps(searchQuery).subscribe((response: ResponseSearchModel) => {
      this.steps = response.responseBody.content.entities;
      this.stepsForNav = this.steps;
      this.content = this.steps[0].content;
      this.buildFinalContent();
      this.setValues();
      this.totalRowCount = response.responseBody.content.pagination.totalRowCount;
      this.isNext = response.responseBody.content.pagination.nextPage;
      this.isPrevious = response.responseBody.content.pagination.previousPage;
      this.isBook = response.responseBody.content.entities[0].article.articleType === 2 ? true : false;
      this.getArticleForNavigation(this.articleId, this.steps[0].id);
      this.updateArticleReadCount();
    }, error => {
      this.alertify.message(error);
    });
  }

  NextStep() {
    this.pageNo += 1;
    this.getStep(this.pageNo);
  }

  previousStep() {
    this.pageNo -= 1;
    this.getStep(this.pageNo);
  }

  highlight(highlighted) {
    return this.content.replace(new RegExp(highlighted, "gi"), match => {
      return '<span class="highlightText">' + match + '</span>';
    });
  }

  public handleClick(event: any) {
    if (this.isLoggedIn) {
      let selection;
      document.addEventListener("selectionchange", event => {
        selection = document.getSelection ? document.getSelection().toString() : "";
        this.highlitedText = selection;
      })

      this.content = this.content.replace(this.highlitedText, '<span class="highlightText">' + this.highlitedText + '</span>')
      this.saveHighlight(this.steps[0].id, this.highlitedText);
    }

  }

  saveHighlight(stepId, highlightedText) {
    var highlight: HighlightAdd = {
      highlightedPart: highlightedText,
      stepId: stepId
    }
    this.stepService.addHighlight(highlight).subscribe(() => {
      this.alertify.success('Hightlight added successfully!');
    }, error => {
      this.alertify.error(error.message);
    });
  }

  buildFinalContent() {
    this.steps[0].highlights.forEach(element => {
      this.content = this.content.replace(element.highlitedPart, '<span class="highlightText">' + element.highlitedPart + '</span>');
    });
  }

  deleteArticle() {
    this.articleService.deleteArticle(this.articleId).subscribe((response: ResponseModel) => {

      this.router.navigate(['/book-list']);
    }, error => {
      this.alertify.message(error);
    });
  }

  updateArticleReadCount() {
    if (!this.isReadCounted) {
      this.articleService.editArticleReadCount(this.articleId).subscribe((response: ResponseModel) => {
        this.isReadCounted = true;
      }, error => {
      });
    }
  }
}
