import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article } from 'src/app/_models/article';

// Get product from Localstorage
let Article = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public currency: string = 'USD';
  public catalogMode : boolean = false;
  
  // For toggling filter of detail page in mobile view
  public filterBar : boolean = false;

  constructor(private http: HttpClient,private toastrService: ToastrService) {

  }

  private Article(): Observable<Article[]> {
    //return this.http.get('assets/data/ecommerce/Article.json').map((res: any) => {
      return null;
  //})
}

  public getArticle(): Observable<Article[]> {
    return this.Article();
  }

  public getProduct(id: number): Observable<Article> {

    return this.Article().pipe(map(items => {
      return items.find((item: Article) => {
        return item.id === id;
      });
    }));
  }


  public getProductByColor(color: any): Observable<Article[]> {
    return this.Article().pipe(map(items =>
    items.filter((item: Article) => {
    //     if (color == item.colors) {
    //       return item.colors
    //     }
    //     else {
    //       return item;
    //     }
    
    return item;
    })
    ));
  }

  public checkDuplicateInObject(tag, Article) {
    var seenDuplicate = false,
      testObject = {};

    Article.map(function (item) {
      var itemPropertyName = item[tag];
      if (itemPropertyName in testObject) {
        testObject[itemPropertyName].duplicate = true;
        item.duplicate = true;
        seenDuplicate = true;
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });

    return seenDuplicate;
  }

  public getProductByCategory(category: string): Observable<Article[]> {
    return this.Article().pipe(map(items =>
      items.filter((item: Article) => {
        if (category == 'all') {
          return item
        }
        else {
          //return item.category === category;
          return item;
        }
      })
    ));
  }
  private tag(): Observable<Article[]> {
    // return this.http.get('assets/data/Article.json').map((res: any) => {
    //   return res;
    // });
    return null;
  }

  public getTags(): Observable<Article[]> {
    return this.Article();
  }

   /*
      ---------------------------------------------
      ----------  Compare Product  ----------------
      ---------------------------------------------
   */

  // Get Compare Article
  public getComapreArticle(): Observable<Article[]> {
    const itemsStream = new Observable(observer => {
      observer.next(Article);
      observer.complete();
    });
    return <Observable<Article[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Article): boolean {
    const item = Article.find(item => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Article): Article | boolean {
    var item: Article | boolean = false;
    if (this.hasProduct(product)) {
      item = Article.filter(item => item.id === product.id)[0];
      const index = Article.indexOf(item);
    } else {
      if(Article.length < 4)
        Article.push(product);
      else 
        this.toastrService.warning('Maximum 4 Article are in compare.'); // toasr services
    }
      localStorage.setItem("compareItem", JSON.stringify(Article));
      return item;
  }

  // Removed Product
  public removeFromCompare(product: Article) {
    if (product === undefined) { return; }
    const index = Article.indexOf(product);
    Article.splice(index, 1);
    localStorage.setItem("compareItem", JSON.stringify(Article));
  }
   
}