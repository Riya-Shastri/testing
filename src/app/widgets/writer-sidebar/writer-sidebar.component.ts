import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/_models/article';
import { Step } from 'src/app/_models/step';
import { ArticleViewService } from 'src/app/_services/article/article-view.service';

@Component({
  selector: 'app-writer-sidebar',
  templateUrl: './writer-sidebar.component.html',
  styleUrls: ['./writer-sidebar.component.scss']
})
export class WriterSidebarComponent implements OnInit {

  @Input() steps: Step[];
  @Input() article: Article;
    
  public href:string;
  subscription : Subscription
  selectedStepId :any;
  constructor(private articleViewService: ArticleViewService) {
    this.href = location.pathname;
  }

  ngOnInit(): void {
  }
  
  emitSelectedId(event: any):void {
    // this.onFilter.emit('Register click');
    this.articleViewService.filter(event);
  }

}
