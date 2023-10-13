import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { promise } from 'protractor';
//import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ResponseSearchModel } from 'src/app/request/response-model';
import { Article } from 'src/app/_models/article';
import { Cart } from 'src/app/_models/cart';
import { AddToCartRequest, RemoveFromCartRequest } from 'src/app/_requestModels/addToCartRequest';
import { CreateOrderRequest } from 'src/app/_requestModels/createOrderRequest';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ArticleService } from 'src/app/_services/article/article.service';
import { CartViewService } from 'src/app/_services/cart/cart-view.service';
import { CartService } from 'src/app/_services/cart/cart.service';
import { NotificationViewService } from 'src/app/_services/notification/notification-view.service';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { SignalRService } from 'src/app/_services/notification/signalR.service';
declare let paypal : any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,AfterViewChecked {
  cart: Cart;
  article: Article;
  finalAmount: number;
  addScript: boolean;
  order: any;
  

  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;
  public defaultPrice: string = '9.99';
  //public payPalConfig?: IPayPalConfig;

  public removeFromCartRequest = {} as RemoveFromCartRequest;
  public createOrderRequest = {} as CreateOrderRequest;
  constructor(private cartService: CartService, private alertify: AlertifyService, private articleService: ArticleService,
    private cartViewService: CartViewService, public signalRService:SignalRService,
    private notifcationViewService : NotificationViewService) { }

  ngOnInit() {
    this.getCartInfo();
    this.ngAfterViewChecked();
  }

  public getCartInfo() {
    this.cartService.getCart().subscribe((response: any) => {
      this.cart = response.responseBody.content.cart;
      this.finalAmount = this.cart.totalAmount;
    }, error => {
      this.alertify.error(error.message);
    });
  }

  removeFromCart(item: any) {
    this.removeFromCartRequest.cartId = this.cart.id;
    this.removeFromCartRequest.cartItemId = item;
    this.cartService.removeFromCart(this.removeFromCartRequest).subscribe((response: ResponseSearchModel) => {
      //this.spinner.hide();
      //this.getCartInfo.emit();
      this.getCartInfo();
      this.emitCartInfo();
    }, error => {
      this.alertify.message(error);
      //this.spinner.hide();
    });
  }
  emitCartInfo(): void {
    this.cartViewService.updateCount(true);
  }

  emitNotificationInfo(): void{
    this.notifcationViewService.updateCount(true);
  }

  public paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AQaRXSojfD5DLlk2875qe0XP3BGH2cyL5N06WCjCf1ZQocfZeNqtl30bRSckS0wbGQTviIHUtBTQA83C',
      production: ''
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions:[
            {
              amount:{
                  total: this.finalAmount,
                  currency: 'USD'
              }
            }
          ]
        }
      });
    },
    onAuthorize: (data,actions)=>{
      return actions.payment.execute().then(payment=>{
        this.alertify.message("payment completed");
        this.createOrderRequest.cartId = this.cart.id;
        this.createOrderRequest.totalAmount = this.cart.totalAmount;
        this.cartService.createOrder(this.createOrderRequest).subscribe((response: any) => {
          this.order = response.responseBody.content.order;
          this.cart = response.responseBody.content.cart;
          localStorage.setItem('userData', this.cart.id.toString());
          this.emitCartInfo();
          this.emitNotificationInfo();
          //send notifications realtime for all users
          // this.signalRService.startConnection();
          // this.signalRService.addTransferOrderDataListener();   
          // this.signalRService.addBroadcastOrderDataListener();
          // this.signalRService.broadCastNotification();
          //this.signalRService.askServer(this.order);
          //this.signalRService.askServerListener();
          //this.signalRService.broadcastMessage(this.order);
          //this.startHttpRequest(data);
        }, error => {
          this.alertify.error(error.message);
        });

      })
    }
  };
  
  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }

  ngAfterViewChecked(): void{
    if(!this.addScript){
      this.AddPayPalScript().then(()=>{
        paypal.Button.render(this.paypalConfig, '#paypal-checkout-button');
      })
    }
  }

  // startHubConnection(){
  //   this.signalRService.startConnection();
  //   setTimeout(()=>{
  //     this.signalRService.askServerListener();
  //     var connectionStarted = "connection started";
  //     this.signalRService.askServer(connectionStarted);
  //   },2000);
  // }

  AddPayPalScript(){
    this.addScript = true;
    return new Promise((resolve,reject)=>{
      let scriptTagElement = document.createElement('script');
      scriptTagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptTagElement.onload = resolve;
      document.body.appendChild(scriptTagElement);

    })
  }

  // private startHttpRequest = (data) => {
  //   this.signalRService.SendNotification(data)
  //     .subscribe(res => {
  //       console.log(res);
  //     })
  // }
  loadStripe() {
     
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(s);
    }
}

}
