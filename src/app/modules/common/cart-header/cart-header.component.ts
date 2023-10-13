import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { interval, Observable, Subscription } from "rxjs";
import { CartItem } from "src/app/_models/cartItem";
import { AlertifyService } from "src/app/_services/alertify.service";
import { AuthLoginService } from "src/app/_services/auth.service";
import { CartViewService } from "src/app/_services/cart/cart-view.service";
import { CartService } from "src/app/_services/cart/cart.service";
import { ProductsService } from "src/app/_services/cart/product.service";
import { NotificationViewService } from "src/app/_services/notification/notification-view.service";
import { NotificationService } from "src/app/_services/notification/notification.service";

@Component({
  selector: "app-cart-header",
  templateUrl: "./cart-header.component.html",
  styleUrls: ["./cart-header.component.scss"],
})
export class CartHeaderComponent implements OnInit {
  shoppingCartItems: [] = [];
  showItem: any;
  isRoleAdmin: boolean;
  cart: any;
  cartItemCount: any;
  notifications: any[] = [];
  notificationSubscription: Subscription;
  cartSubscription: Subscription;
  isLoading: boolean;
  notificationCount: number;
  userName: string;
  constructor(
    private cartService: CartService,
    private cartViewService: CartViewService,
    private productService: ProductsService,
    private authService: AuthLoginService,
    private notificationService: NotificationService,
    private alertify: AlertifyService,
    private router: Router,
    private notificationViewService: NotificationViewService
  ) {
    if (this.loggedIn()) {
      this.cartItemCount = localStorage.getItem("cartCount");
      interval(30000).subscribe((x) => this.getNotificationsLite());
    }
    this.cartSubscription = cartViewService.listen().subscribe(() => {
      this.getCartInfo();
    });
  }

  ngOnInit(): void {
    if (this.loggedIn()) {
      this.getNotifications();
      this.getNotificationsLite();
      this.GetIfRoleAdmin();
      this.getCartInfo();
      this.userName = localStorage.getItem("userName");
    }
  }
  public updateCurrency(curr) {
    this.productService.currency = curr;
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  GetIfRoleAdmin() {
    this.isRoleAdmin = this.authService.isRoleMatch("Admin");
  }

  public getCartInfo() {
    if (this.isRoleAdmin) {
      //temp config for hosting
      this.cartService.getCartForNav().subscribe(
        (response: any) => {
          this.cart = response.responseBody.content.cart;
          localStorage.setItem(
            "cartCount",
            this.cart.cartItems.length.toString()
          );
          this.cartItemCount = localStorage.getItem("cartCount");
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    }
  }

  getNotifications() {
    this.notificationCount = null;
    this.notificationService.getNotification().subscribe(
      (response: any) => {
        this.notifications = response.responseBody.content;
      },
      (error) => {
        this.isLoading = false;
        this.alertify.error(error.message);
      }
    );
  }

  clickNotifications() {
    this.getNotifications();
    this.viewNotifications();
  }

  goToCart() {
    this.router.navigate(["/cart"]);
  }

  readNotification(itemId) {
    this.notificationService.readNotification(itemId).subscribe(
      (response: any) => {
        this.notifications = null;
        this.viewNotifications();
        this.router.navigate(["/notifications"]);
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  viewNotifications() {
    this.notificationService.readNotifications().subscribe(
      (response: any) => {
        this.notificationCount = 0;
        this.getNotifications();
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  loggedOut() {
    return !this.authService.loggedIn();
  }

  signup() {
    this.router.navigate(["/register"]);
  }

  signin() {
    this.router.navigate(["/login"]);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("fullName");
    localStorage.removeItem("cartCount");
    //this.signalRService.stopHubConnection();
    this.alertify.message("Logged out!");
    this.router.navigate(["/home"]);
  }

  getNotificationsLite() {
    if (this.loggedIn() == true) {
      this.notificationService.getNotificationsLite().subscribe(
        (response: any) => {
          if (response != null) {
            var count = 0;
            this.notificationCount = parseInt(response.responseBody.content);
            localStorage.setItem(
              "notificationCount",
              this.notificationCount.toString()
            );
          }
        },
        (error) => {}
      );
    }
  }

  goToHome() {
    if (this.loggedIn() === true) {
      this.router.navigate(["/userhome"]);
    } else {
      this.router.navigate(["/home"]);
    }
  }

  GoToProfile() {
    this.router.navigate(["/user/" + this.userName + "/settings/general"]);
  }
}
