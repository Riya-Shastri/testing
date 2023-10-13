import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ArticleLayourViewService } from 'src/app/_services/article/article-layout-view.service';

@Component({
  selector: 'app-user-home-layout',
  templateUrl: './user-home-layout.component.html',
  styleUrls: ['./user-home-layout.component.css']
})
export class UserHomeLayoutComponent implements OnInit {
  backgroundurl : any = "../assets/images/writer.jpg";
  receivingObj: any;
  lastReadArticles: any;
  subscription: Subscription;
  constructor(private articlelayoutService:ArticleLayourViewService) { }

  ngOnInit(): void {
    this.loadRecent();
  }

  loadRecent() {
    this.subscription = this.articlelayoutService.subject.subscribe((receivingObj) => {
      this.lastReadArticles = receivingObj;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
