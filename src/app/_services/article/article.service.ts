import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";
import {
  HttpClient,
  HttpHeaders,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { ResponseModel } from "src/app/request/response-model";
import { Observable } from "rxjs";
import { Article } from "src/app/_models/article";
import { Injectable } from "@angular/core";
import { RequestModel } from "src/app/request/requestModel";

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "Bearer " + localStorage.getItem("token"),
  }),
};

@Injectable({
  providedIn: "root",
})
export class ArticleService {
  baseUrl = environment.baseUrl;
  jwtHelperService = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  getArticles(requestForm: RequestModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(this.baseUrl + "article", requestForm);
  }

  getArticlesforAdmin(requestForm: RequestModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "article/GetArticlesForAdmin",
      requestForm
    );
  }

  getArticlesForAutoComplete(
    requestForm: RequestModel
  ): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "article/GetAutoCompleteArticles",
      requestForm
    );
  }

  getUserArticleSeries(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "articleSeries/GetUserSeries"
    );
  }

  addUserArticleSeries(model: any): Observable<any> {
    return this.http.post(
      this.baseUrl + "articleSeries/add",
      model,
      httpOptions
    );
  }

  getArticle(id): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "article/getArticle/" + id
    );
  }

  getLastReadArticle(
    articleType: any,
    count: number
  ): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl +
        "article/GetReadingHistory?articleType=" +
        articleType +
        "&count=" +
        count
    );
  }

  addArticle(model: any): Observable<any> {
    return this.http.post(this.baseUrl + "article/add", model, httpOptions);
  }

  getArticleWithoutSteps(id): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "article/getArticleWithoutStep/" + id
    );
  }

  getArticleForNavigation(id): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "article/getArticleForNavigation/" + id
    );
  }

  getArticleForNavigationWithStepId(id, stepId): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl +
        "article/GetArticleForNavigationWithStepId?id=" +
        id +
        "&selectedStepId=" +
        stepId
    );
  }

  editArticle(model: any, id: string): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/edit?id=" + id,
      model,
      httpOptions
    );
  }

  approveArticle(id: number): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/approveArticle?id=" + id,
      httpOptions
    );
  }

  disapproveArticle(model: any, id: number): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/disapproveArticle?id=" + id,
      model,
      httpOptions
    );
  }

  deleteArticle(id: number): Observable<any> {
    return this.http.get(this.baseUrl + "article/delete/" + id);
  }

  saveArticle(id: number): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/save?articleId=" + id,
      httpOptions
    );
  }

  addComment(model: any): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/addComment",
      model,
      httpOptions
    );
  }

  getComments(requestForm: RequestModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      this.baseUrl + "article/getComments",
      requestForm
    );
  }

  editArticleReadCount(id: number): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/UpdateArticleReadCount?articleId=" + id,
      httpOptions
    );
  }

  draftArticle(id: number): Observable<any> {
    return this.http.post(
      this.baseUrl + "article/DraftArticle?articleId=" + id,
      httpOptions
    );
  }

  saveBookMark(model: any): Observable<any> {
    return this.http.post(this.baseUrl + "bookmark/add", model, httpOptions);
  }

  getCurrentBookMark(articleId): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      this.baseUrl + "bookmark/GetCurrentBookmark?articleId=" + articleId
    );
  }
}
