import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseModel } from 'src/app/request/response-model';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { Article } from 'src/app/_models/article';
import { Injectable } from '@angular/core';
import { RequestModel } from 'src/app/request/requestModel';
import { CartItem } from 'src/app/_models/cartItem';
import { AlertifyService } from '../alertify.service';

const httpOptions =
{
    headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
}

@Injectable({
    providedIn: 'root'
})

export class CartService {
    public cartItems: BehaviorSubject<CartItem[]> = new BehaviorSubject([]);
    public observer: Subscriber<{}>;
    getTotalAmount(): Observable<number> {
        return null;
    }

    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient, private toastr: AlertifyService) { }

    addToCart(model: any): Observable<any> {
        return this.http.post(this.baseUrl + 'cart/addItemToCart', model, httpOptions);
    }

    createOrder(model: any): Observable<any> {
        return this.http.post(this.baseUrl + 'order/add', model, httpOptions);
    }

    removeFromCart(model: any): Observable<any> {
        return this.http.post(this.baseUrl + 'cart/removeItemFromCart', model, httpOptions);
    }

    getCart(): Observable<any> {
        return this.http.get(this.baseUrl + 'cart/GetCart', httpOptions);
    }

    getCartForNav(): Observable<any> {
        return this.http.get(this.baseUrl + 'cart/GetCartForNav', httpOptions);
    }

    getOrders(requestForm: RequestModel): Observable<ResponseModel> 
    { 
        return this.http.post<ResponseModel>(this.baseUrl + 'order/getOrders',requestForm, httpOptions);
    }

    public getItems(): Observable<CartItem[]> {
        const itemsStream = new Observable(observer => {
          //observer.next(Article);
          observer.complete();
        });
        return <Observable<CartItem[]>>itemsStream;
      }
    
      public addToCart2(product: Article, quantity: number): CartItem | boolean {
        // var item: CartItem | boolean = false;
    
        // let hashItem = Article.find((items, index) => {
        //   if (items.product.id == product.id) {
        //     let qty = Article[index].quantity + quantity;
        //     let stock = this.calculateStockCounts(Article[index], quantity);
        //     if (qty != 0 && stock) {
        //       Article[index]['quantity'] = qty;
        //       this.toastr.success('This product has been already added to cart.');
        //       localStorage.setItem('cartItem', JSON.stringify(Article));
    
        //     }
        //     return true;
        //   }
        // });
    
        // if (!hashItem) {
        //   item = { product: product, quantity: quantity };
        //   Article.push(item);
        //   this.toastr.success('This product has been added to cart.');
        // }
        // localStorage.setItem('cartItem', JSON.stringify(Article));
        return null;
    
      }
    
      public calculateStockCounts(product: CartItem, quantity: number): CartItem | Boolean {
        let qty = product.quantity + quantity;
        let stock = null//product.product.stock;
        if (stock && stock < qty) {
          this.toastr.error('You can not add more items than available. In stock ' + stock + ' items.');
          return false
        }
        return true
      }
    
      // Removed in cart
      public removeFromCart2(item: CartItem) {
        // if (item === undefined) return false;
        // const index = Article.indexOf(item);
        // Article.splice(index, 1);
        // localStorage.setItem("cartItem", JSON.stringify(Article));
      }
    
    
      public updateCartQuantity(product: Article, quantity: number): CartItem | boolean {
        // return Article.find((items, index) => {
        //   if (items.product.id == product.id) {
        //     let qty = Article[index].quantity + quantity;
        //     let stock = this.calculateStockCounts(Article[index], quantity);
        //     if (qty != 0 && stock)
        //       Article[index]['quantity'] = qty;
        //     localStorage.setItem("cartItem", JSON.stringify(Article));
        //     return true;
        //   }
        // });
        return null;
      }
      public getTotalAmount2(): Observable<number> {
        // return this.cartItems.map((product: CartItem[]) => {
        //   return Article.reduce((prev, curr: CartItem) => {
        //     return prev + curr.product.price * curr.quantity;
        //   }, 0);
        // });
        return null;
      }
}