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

export class NotificationViewService{
    private _listners = new Subject<any>();
    private _notificationListners = new Subject<any>();

    listen(): Observable<any> {
        return this._listners.asObservable();
    }

    listenNotifications(): Observable<any>{
        return this._notificationListners.asObservable();
    }

    updateCount(count: boolean) {
        this._listners.next(count);
    }
    
    updateNotificationCount(count: boolean) {
        this._notificationListners.next(count);
    }


}