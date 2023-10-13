import { Component, OnInit } from '@angular/core';
import { ResponseModel, ResponseSearchModel } from 'src/app/request/response-model';
import { ArticleService } from 'src/app/_services/article/article.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-general',
  templateUrl: './user-general.component.html',
  styleUrls: ['./user-general.component.css']
})
export class UserGeneralComponent implements OnInit {
  articles: any;
  constructor(private articleService: ArticleService, private userService: UserService) { }

  ngOnInit() {
    this.getArticleHostory();
  }

  getArticleHostory(){
    //GetReadingHistory\
    this.userService.getReadHistory(1).subscribe((response: ResponseModel) => {
      this.articles = response.responseBody.content;
    }, error => {
      //this.alertify.message(error);
    });
  }
}