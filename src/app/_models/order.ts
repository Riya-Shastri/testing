import { Article } from './article';
import { Cart } from './cart';
import { User } from './user';

export interface Order
{
    id:number;
    userId: number;
    isCompleted: boolean;
    isShipped: boolean;
    cartId: number;
    totalAmount: number;
    createdDate: Date;
    updatedDate: Date;
    productInfo: Article[];
    cart: Cart;
    user: User;
}