import { Card } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, clearCart, decreaseCart, getTotals, removeFromCart } from "./cartSlice";
import './cart.css';
import { useEffect } from "react";
import PayButton from "./PayButton";

const CartPage = () => {
  const cart = useSelector((state: any) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getTotals());
  }, [cart, dispatch]);
  //console.log(cart);
  return (
    <div className="cart-container">
      <h2>Shopping cart</h2>
      {cart.cartItems.length === 0 ? (
        <Card>
          <div className="cart-empty">
            <p>Your cart is currently empty</p>
            <div className="continue-shopping">
              <Link to="/courses">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>

                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div>
          <div className="titles">
            <h3 className="">Course</h3>
            <h3 className="">Price</h3>
            <h3 className="">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {cart.cartItems.length > 0 &&
              cart.cartItems.map((cartItem: any) => {
                return (
                  <div className="cart-item" key={cartItem._id}>
                    <div className="">
                      <h3>{cartItem.title}</h3>
                      <p>{cartItem.description}</p>
                      <div className="cart-product"><button className="color-red-500" onClick={(e) => {e.preventDefault; dispatch(removeFromCart(cartItem))} }>Remove</button></div>
                    </div>
                    <div className="card-product-price">${cartItem.price}</div>
                    <div className="cart-product-quantity">
                      <button onClick={(e) => {e.preventDefault; dispatch(decreaseCart(cartItem))} }>-</button>
                      <div className="count">{cartItem.cartQuantity}</div>
                      <button onClick={(e) => {e.preventDefault; dispatch(addToCart(cartItem))} }>+</button>
                    </div>
                    <div className="cart-product-total-price">${cartItem.cartQuantity * cartItem.price}</div>
                  </div>
                );
              })}
          </div>
          {/* <div className="titles cart-item">
            <h3 className=""></h3>
            <h3 className=""></h3>
            <h3 className="">Total Quantity: {cart.cartTotalQuantity ?? 0}</h3>
            <h3 className="">Total Price: {cart.cartTotalAmount ?? 0}</h3>
          </div>  */}  
          <div className="cart-summary">
            <button className="clear-btn" onClick={(e) => {e.preventDefault(); dispatch(clearCart());}}>
              Clear cart
            </button>
            
            <div className="cart-checkout">
              
                <div className="subtotal">
                  <span>SubTotal <p>{cart.cartTotalQuantity} Item</p></span>
                  <span className="amout">${cart.cartTotalAmount}</span>
                </div>
                
                <PayButton cartItems={cart.cartItems} />

                <button onClick={() => navigate('/courses')} type="button" className="mt-2 continue-shopping">Continue shopping</button>
            </div>
          </div>        


        </div>
      )}
    </div>
  );
};

export default CartPage;