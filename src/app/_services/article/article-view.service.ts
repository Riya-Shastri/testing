import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Article } from 'src/app/_models/article';
import { Step } from 'src/app/_models/step';

const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}

@Injectable({
    providedIn: 'root'
})

export class ArticleViewService{
    private _listners = new Subject<any>();
    private _articlelistner = new Subject<any>();
    private _commentListener = new Subject<any>();
    private _stepListner = new Subject<any>();
    private _anchorListner = new Subject<any>();
    private _anchorListnerBack = new Subject<any>();

    listen(): Observable<any> {
       return this._listners.asObservable();
    }
    listenAnchor(): Observable<any> {
        return this._anchorListner.asObservable();
    }

     listenAnchorBack(): Observable<any> {
        return this._anchorListnerBack.asObservable();
     }

    listenBackArticle(): Observable<any> {
        return this._articlelistner.asObservable();
     }

     listenBackStep(): Observable<any> {
        return this._stepListner.asObservable();
     }

     listenBackRefresh():  Observable<any> {
        return this._commentListener.asObservable();
     }

    filter(filterBy: string) {
       this._listners.next(filterBy);
    }

    anchor(filterBy: string) {
        this._anchorListner.next(filterBy);
    }

    triggerRefresh(){
        this._commentListener.next(true);
    }

    passAnchor(selectedStepId: any) {
        this._anchorListnerBack.next(selectedStepId);
    }

    passArticle(article:Article){
        this._articlelistner.next(article);
    }

    passStep(steps:Step[]){
        this._stepListner.next(steps);
    }

}