import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/_models/article';
import { Step } from 'src/app/_models/step';
import { ArticleViewService } from 'src/app/_services/article/article-view.service';

@Component({
  selector: 'app-step-writer-layout',
  templateUrl: './step-writer-layout.component.html',
  styleUrls: ['./step-writer-layout.component.css']
})
export class StepWriterLayoutComponent implements OnInit {

  @Input() steps: Step[];
  @Input() article: Article;
  
  public href:string;
  subscription : Subscription
  selectedStepId :any;
  constructor(private articleViewService: ArticleViewService) {

  }

  ngOnInit() {
    this.href = location.pathname;
  }

  emitSelectedId(event: any):void {
    // this.onFilter.emit('Register click');
    this.articleViewService.filter(event);
  }

}
