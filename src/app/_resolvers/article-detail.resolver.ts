import { Article } from '../_models/article';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArticleService } from '../_services/article/article.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ArticleDetailResolver implements Resolve<Article>{
    resolve(route: ActivatedRouteSnapshot): Observable<Article> {
        return this.articleService.getArticle(route.params['id']).pipe(catchError(error => {
            this.router.navigate(['/article-list']);
            return of(null);
        }))
    }

    constructor(private articleService: ArticleService,
        private router: Router,
        private alertifyService: AlertifyService) { }
}