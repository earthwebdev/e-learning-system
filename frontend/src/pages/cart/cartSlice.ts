import { createSlice } from "@reduxjs/toolkit";
import { successToast } from "../../services/toastify.service";
interface cartInterface {
    cartItems: Array<{}>;
    cartTotalQuantity: number;
    cartTotalAmount: number;
}
const initialState: any = {
    cartItems: [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0
}

const cartSlice = createSlice({
    name: 'CartSlice',
    initialState,
    reducers:{
        addToCart: (state, action) => {
            const existingIndex = state.cartItems.findIndex((item: any) => item._id.toString() === action.payload._id.toString());
            //console.log(existingIndex);
            if(existingIndex >= 0){
                state.cartItems[existingIndex] = {
                    ...state.cartItems[existingIndex],
                    cartQuantity: state.cartItems[existingIndex].cartQuantity + 1
                }
            } else {
                 let tempCourseItem: any = { ...action.payload, cartQuantity: 1 }
                state.cartItems.push(tempCourseItem); 
                successToast('Course added to cart')
            } 
        },
        decreaseCart: (state, action) => {
            const existingIndex = state.cartItems.findIndex((item: any) => item._id.toString() === action.payload._id.toString());
            //console.log(existingIndex);
            if(existingIndex >= 0){
                if(state.cartItems[existingIndex].cartQuantity > 1){
                    state.cartItems[existingIndex] = {
                            ...state.cartItems[existingIndex],
                            cartQuantity: state.cartItems[existingIndex].cartQuantity - 1
                    }
                } else if(state.cartItems[existingIndex].cartQuantity === 1){
                    //state.cartItems.splice(existingIndex, 1);
                    const newCartItems = state.cartItems.filter((item: any) => {
                        return item._id !== action.payload._id
                    });
                    state.cartItems = newCartItems;                                        
                }
                    
                
            }  
        },
        removeFromCart: (state, action) => {
            state.cartItems.map((cartItem: any) => {
                if(cartItem._id === action.payload._id){
                    const newCartItems = state.cartItems.filter((item: any) => {
                        return item._id !== action.payload._id
                    });
                    state.cartItems = newCartItems;
                }
            });
        },
        getTotals: (state) => {
            let { total, quantity } = state.cartItems.reduce((cartData: any, item: any) => {
                const itemTotal = item.price * item.cartQuantity;

                cartData.total += itemTotal;
                cartData.quantity += item.cartQuantity;
                return cartData;
            }, {
                quantity: 0,
                total: 0
            });
            total = parseFloat(total.toFixed(2));
            state.cartTotalQuantity = quantity;
            state.cartTotalAmount = total;
        },
        clearCart: (state) => {
            state.cartItems = [];
        }

    }
});

export const {addToCart, decreaseCart, removeFromCart, getTotals, clearCart} = cartSlice.actions;
export default cartSlice.reducer;