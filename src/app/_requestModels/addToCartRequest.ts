export interface AddToCartRequest
{
    itemId:number;
    cartId: number;
    price: number;
    quantity: number;
}

export interface RemoveFromCartRequest
{
    cartItemId:number;
    cartId: number;
}