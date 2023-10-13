import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AlertifyService } from "../alertify.service";
import { AuthLoginService } from "../auth.service";
import { CategoryService } from "../catgory/category.service";

export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  icon?: string;
  badgeType?: string;
  badgeValue?: string;
  visible: boolean;
  active?: boolean;
  megaMenu?: boolean;
  megaMenuType?: string; // small, medium, large
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnInit {
  titles: any = {};
  subCategories: any = [];
  categories: any = [];
  isRoleAdmin: any = false;

  constructor(
    public authService: AuthLoginService,
    private alertify: AlertifyService,
    private categoryService: CategoryService
  ) {
    this.GetIfRoleAdmin();
    this.getNavBarTitles();
  }
  ngOnInit(): void {}

  MENUITEMS: Menu[] = [];

  clearAndPushMenu() {
    this.MENUITEMS.splice(0);
    this.getNavBarTitles();
  }

  pushToMenu(injectedTitles) {
    this.MENUITEMS.push(
      {
        title: "Reviews & Ratings",
        type: "link",
        path: "/article-list/Reviews & Ratings",
        visible: true,
      },
      {
        title: "Technologies",
        type: "link",
        path: "/article-list/Technologies",
        visible: true,
      },
      {
        title: injectedTitles.Books,
        type: "link",
        path: "/book-list/",
        visible: true,
      },
      {
        title: "Programming",
        type: "link",
        path: "/article-list/Programming",
        visible: true,
      },
      {
        title: injectedTitles.Articles,
        type: "link",
        path: "/article-list",
        visible: true,
      },
      {
        title: injectedTitles.Categories,
        visible: true,
        type: "sub",
        megaMenu: false,
        megaMenuType: "small",
        icon: "expand_more",
        path: "/article-list",
        children: this.categories,
      }
    );

    if (this.authService.isRoleMatch("Admin") === true) {
      this.MENUITEMS.push(
        {
          title: injectedTitles.Members,
          visible: true,
          type: "link",
          path: "/user-list",
        },
        {
          title: injectedTitles.CreateArticle,
          visible: true,
          type: "link",
          path: "/article",
        }
      );
      // this.MENUITEMS.push({
      //   title: injectedTitles.Followings,
      //   type: "link",
      //   path: "/follower-list",
      //   visible: this.authService.loggedIn(),
      // });
    }
    console.log(this.MENUITEMS);
  }

  getNavBarTitles() {
    if (
      localStorage.getItem("preferredLanguage") == "en-US" ||
      !localStorage.getItem("preferredLanguage")
    ) {
      let injectedTitles = {
        Articles: "Articles",
        Books: "Books",
        Categories: "Categories",
        Dynamics: "Dynamics 365",
        Azure: "Azure",
        Javascript: "Javascript",
        DotNet: ".NET",
        CreateArticle: "Create Article",
        Followings: "Followings",
        Home: "Home",
        Members: "Members",
        Profile: "Profile",
        Settings: "Settings",
      };
      this.pushToMenu(injectedTitles);
    } else {
      this.authService.getNavbarTitles().subscribe(
        (response: any) => {
          let injectedTitles = response.responseBody.content;
          let newinjectedTitles = this.removeDuplicates(injectedTitles);
          this.pushToMenu(newinjectedTitles);
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

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  removeDuplicates(arr: any): any {
    let newarrayOfKeys = [];
    let newarray = {};
    for (let i = 0; i < Object.keys(arr).length; i++) {
      if (!this.ifContainsInArray(newarrayOfKeys, Object.keys(arr)[i])) {
        newarrayOfKeys.push(Object.keys(arr)[i]);
        newarray[Object.keys(arr)[i]] = arr[Object.keys(arr)[i]];
      }
    }

    return newarray;
  }

  ifContainsInArray(arr: any, item: any): boolean {
    for (let i = 0; i < Object.keys(arr).length; i++) {
      if (Object.keys(arr)[i] === item) {
        return true;
      }
    }
    return false;
  }
}
