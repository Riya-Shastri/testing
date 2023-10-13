import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RequestModel } from 'src/app/request/requestModel';
import { Order } from 'src/app/_models/order';
import { OrderSearchRequest } from 'src/app/_requestModels/orderSearchRequest';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { CartService } from 'src/app/_services/cart/cart.service';

@Component({
  selector: 'app-user-purchases',
  templateUrl: './user-purchases.component.html',
  styleUrls: ['./user-purchases.component.css']
})
export class UserPurchasesComponent implements OnInit {
  orders : Order[];
  currentUser: any;
  cart: any;
  userId : number;
  finalAmount: any;
  pageSize : number = 10;
  pageNo: number = 1;
  public orderSearchRequest = {} as OrderSearchRequest;
  public filterRequest = {} as RequestModel;
  public 
  constructor(private cartService: CartService, private alertify : AlertifyService, 
    private params : ActivatedRoute) { }

  ngOnInit() {
    this.GetOrders();
    this.userId = parseInt(this.params.snapshot.paramMap.get('id'));
  }

  GetOrders(){
    const searchQuery: any = {
      Filters: {
        UserId: parseInt(this.params.snapshot.paramMap.get('id'))
      },
      Paging: {
        PageNo: 1,
        PageSize: 50
      },
      Sorting: [
        {
          ColumnName: 'Value',
          SortOrder: 'ASC'
        }
      ]
    };
    this.cartService.getOrders(searchQuery).subscribe((response: any) => {
      this.orders = response.responseBody.content.entities;
    }, error => {
      this.alertify.error(error.message);
    });
  }

}
