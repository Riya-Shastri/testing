import { Component, OnInit, TemplateRef } from "@angular/core";
import { AuthLoginService } from "../../../_services/auth.service";
import { Router } from "@angular/router";
import { AlertifyService } from "../../../_services/alertify.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { UserService } from "src/app/_services/user.service";
import { ResponseModel } from "src/app/request/response-model";
import { User } from "src/app/_models/user";
import { CartService } from "src/app/_services/cart/cart.service";
import { Cart } from "src/app/_models/cart";
import { CartViewService } from "src/app/_services/cart/cart-view.service";
import { Observable, Subscription } from "rxjs";
import { NotificationService } from "src/app/_services/notification/notification.service";
// import * as signalR from '@microsoft/signalR'
import { NotificationViewService } from "src/app/_services/notification/notification-view.service";
import { CategoryService } from "src/app/_services/catgory/category.service";
import { NavService } from "src/app/_services/nav/nav.service";
import { CartItem } from "src/app/_models/cartItem";
// import { SignalRService } from 'src/app/_services/notification/signalR.service';
@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  public menuItems: Menu[];
  public openSide: boolean = false;
  public activeItem: string = "home";
  public active: boolean = false;
  public activeChildItem: string = "";
  public overlay: boolean = false;
  showItem: any;
  model: any = {};
  shoppingCartItems: [] = [];
  modalRef: BsModalRef;
  userImage: any;
  isLoading: boolean;
  user: User;
  fullName: string;
  isRoleAdmin: boolean;
  subCategories: any = [];
  categories: any = [];
  cart: any;
  notificationCount: any;
  titles: any = {
    Articles: "Articles",
    Books: "Books",
    Categories: "Categories",
    CreateArticle: "Create Article",
    Followers: "Followers",
    Home: "Home",
    Members: "Members",
    Profile: "Profile",
    Settings: "Settings",
  };
  notifications: any;
  subscription: Subscription;
  notificationSubscription: Subscription;
  menuSubscription: Subscription;
  cartItemCount: any;
  constructor(
    public authService: AuthLoginService,
    private userService: UserService,
    private notificationService: NotificationService,
    private cartService: CartService,
    private router: Router,
    private alertify: AlertifyService,
    private modalService: BsModalService,
    private notificationViewService: NotificationViewService,
    private cartViewService: CartViewService,
    public navServices: NavService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.LoadCategories();
    if (this.loggedIn()) {
      this.getUser();
      if (!localStorage.getItem("cartCount")) {
        this.getCartInfo();
      }

      this.notificationCount = localStorage.getItem("notificationCount");
      this.cartItemCount = localStorage.getItem("cartCount");
    }

    this.getNavBarTitles();
    this.GetIfRoleAdmin();

    if (this.loggedIn) {
      this.subscription = this.cartViewService.listen().subscribe((m: any) => {
        if (m) {
          this.getCartInfo();
        }
      });
    }
  }

  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success("Logged in successfully");
      },
      (error) => {
        this.alertify.success("Log in failed");
      },
      () => {
        this.router.navigate(["/user"]);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuSubscription.unsubscribe();
  }
  getUser() {
    this.userImage = localStorage.getItem("userImage");
    this.fullName = localStorage.getItem("fullName");
  }
  getCategories() {
    this.categoryService.getCategoriesForNavigation().subscribe(
      (response: any) => {
        this.categories = response.responseBody.content;
        this.menuSubscription = this.navServices.items.subscribe(
          (menuItems) => {
            this.menuItems = menuItems;
            for (let i = 0; i < this.menuItems.length; i++) {
              if (this.menuItems[i].title == undefined) {
                this.menuItems.splice(i, i);
              }
              if (this.menuItems[i].title == "Categories") {
                this.menuItems[i].children = this.categories;
              }
            }
            this.menuItems = this.uniqByForEach(this.menuItems);
          }
        );
      },
      (error) => {
        this.alertify.error(error.message);
      }
    );
  }

  removeDocument(doc, items) {
    items.forEach((item, index) => {
      if (item === doc) items.splice(index, 1);
    });
  }
  // public updateCurrency(curr) {
  //   this.productService.currency = curr;
  // }

  // public getTotal(): Observable<number> {
  //   //return this.cartService.getTotalAmount();
  // }

  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }
  LoadCategories() {
    if (this.categories.length == 0) this.getCategories();
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
    localStorage.removeItem("nameid");
    //this.signalRService.stopHubConnection();
    localStorage.clear();
    this.alertify.message("Logged out!");
    this.router.navigate(["/home"]);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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

  getNavBarTitles() {
    if (
      localStorage.getItem("preferredLanguage") != "en-US" ||
      localStorage.getItem("preferredLanguage")
    ) {
    } else {
      this.authService.getNavbarTitles().subscribe(
        (response: any) => {
          this.titles = response.responseBody.content;
        },
        (error) => {
          this.alertify.error(error.message);
        }
      );
    }
  }

  GetIfRoleAdmin() {
    this.isRoleAdmin = this.authService.isRoleMatch("Admin");
  }

  goToUser() {
    this.router.navigate(["/user/", this.authService.decodedToken.nameid]);
  }

  toggleSidebar() {
    this.openSide = !this.openSide;
  }

  closeOverlay() {
    this.openSide = false;
  }

  //For Active Main menu in Mobile View
  setActive(menuItem: string) {
    if (this.activeItem === menuItem) {
      this.activeItem = "";
    } else {
      this.activeItem = menuItem;
    }
  }

  isActive(item: string) {
    return this.activeItem === item;
  }

  // For Active Child Menu in Mobile View
  setChildActive(subMenu: string) {
    if (this.activeChildItem === subMenu) {
      this.activeChildItem = "";
    } else {
      this.activeChildItem = subMenu;
    }
  }

  ischildActive(subMenu: string) {
    return this.activeChildItem === subMenu;
  }

  uniqByForEach<T>(array: T[]) {
    const result: T[] = [];
    const titles: string[] = [];
    array.forEach((item) => {
      let itemObj = item as Menu;
      if (!titles.includes(itemObj.title)) {
        result.push(item);
      }
      result.forEach((element) => {
        let elementObj = element as Menu;
        if (!titles.includes(elementObj.title)) {
          titles.push(elementObj.title);
        }
      });
    });

    return result;
  }
}

export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  icon?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  megaMenu?: boolean;
  megaMenuType?: string; // small, medium, large
  bookmark?: boolean;
  children?: Menu[];
}
