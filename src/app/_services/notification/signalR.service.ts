import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { env } from 'process';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';
import { NotificationViewService } from './notification-view.service';
const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}
@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    public data: any;
    public broadcastedData : any;
    baseUrl = environment.baseUrl;
    constructor(private http :HttpClient, private notificationViewService: NotificationViewService){

    }

    public hubConnection: signalR.HubConnection

    //create hub connection
    private onlineUsersSource = new BehaviorSubject<string[]>([]);
    onlineUsers$ = this.onlineUsersSource.asObservable();
    //create hub connection
    createHubConnection(userToken: any){
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(environment.hubUrl+'Online',{
        accessTokenFactory: ()=>userToken
      }).withAutomaticReconnect().build()
      this.hubConnection.serverTimeoutInMilliseconds = 120000;
      this.hubConnection.start()

      this.hubConnection.on('UserIsOnline', username=>{
      })

      this.hubConnection.on('GetOnlineUsers', (usernames: string[])=>{
        this.onlineUsersSource.next(usernames);
      })

      this.hubConnection.on('UserIsOffline', username=>{
      })
    }

    stopHubConnection(){
      if(this.hubConnection){
        this.hubConnection.stop().catch(error=>console.log(error));
      }
    }

      // public startConnection = (token) => {
      //   this.hubConnection = new signalR.HubConnectionBuilder()
      //   .withUrl(environment.hubUrl+'NotificationHub',{
      //     accessTokenFactory: ()=>token
      //   }).withAutomaticReconnect().build()

      //   this.hubConnection
      //     .start()
      //     .then(() => console.log('Connection started'))
      //     .catch(err => console.log('Error while starting connection: ' + err))
      // }

      // public addTransferOrderDataListener = () => {
      //   this.hubConnection.on('SendOrder', (data) => {
      //     this.data = data;
      //   });
      // }

      // askServer(data){
      //     this.hubConnection.invoke('SendMessage',data).catch(err=>console.log(err)).then((data)=>{
      //     });
      // }

      // askServerListener(){
      //     this.hubConnection.on("broadcastMessage",(data)=>{
      //         if(data){
      //           this.notificationViewService.updateCount(true);
      //         }
      //     })
      // }
    // private connection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:5001/NotificationHub")   // mapping to the chathub as in startup.cs
    //     .configureLogging(signalR.LogLevel.Information)
    //     .build();
    // readonly POST_URL = "https://localhost:5001/api/order/sendOrder"

    // private receivedMessageObject: any = {};
    // private sharedObj = new Subject<any>();

    // constructor(private http: HttpClient) {
    //     this.connection.onclose(async () => {
    //         await this.start();
    //     });
    //     this.connection.on("broadcastMessage", (data) => { this.mapReceivedMessage(data); });
    //     this.start();
    // }


    // // Strart the connection
    // public async start() {
    //     try {
    //         await this.connection.start();
    //     } catch (err) {
    //         setTimeout(() => this.start(), 5000);
    //     }
    // }

    // private mapReceivedMessage(data: any): void {
    //     this.receivedMessageObject.user = data;
    //     this.sharedObj.next(this.receivedMessageObject);
    // }

    // /* ****************************** Public Mehods **************************************** */

    // // Calls the controller method
    // public broadcastMessage(msgDto: any) {
    //     this.http.post(this.POST_URL, msgDto).subscribe(data => console.log(data));
    //     // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
    // }

    // public retrieveMappedObject(): Observable<any> {
    //     return this.sharedObj.asObservable();
    // }

}