import { CartItem } from './cartItem';

export interface Cart
{
    id:number;
    userId: number;
    isCompleted: boolean;
    totalAmount: number;
    productCover: string;
    productName: string;
    productAuthor: string;
    createdDate: Date;
    updatedDate: Date;
    cartItems: CartItem[];
}