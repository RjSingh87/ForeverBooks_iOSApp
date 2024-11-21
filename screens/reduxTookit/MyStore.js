import {configureStore} from '@reduxjs/toolkit';
import productReducer from './product/ProductSlice';
import cartReducer from './cart/CartSlice';
import addWishListReducer from './wishList/AddWishSlice';
import userWishList from './wishList/WishListSlice';
import cartListReducer from'./cart/CartListSlice';
import profileReducer from './address/ProfileSlice';
import addressReducer from './address/AddressListSlice';
import singleProductReducer from './product/SingleProductSlice'

const MyStore = configureStore({
    reducer:{
        cart: cartReducer,
        product:productReducer,
        addTowishList:addWishListReducer,
        wishList:userWishList,
        cartList:cartListReducer,
        profileData:profileReducer,
        userAddressList:addressReducer,
        singleProduct:singleProductReducer
    }
});
export default MyStore;
