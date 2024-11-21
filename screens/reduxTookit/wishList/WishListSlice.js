import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {apiRoot} from '../../../constant';
import services from '../../../services';

export const fetchWishList = createAsyncThunk('wish/wishListApi', 
  async (data)=>{
    const response = await services.post(apiRoot.getWishList, data);
    if(response.status=="success"){
      return response.data;
    } else {
      return [];
    }
})
const WishListSlice = createSlice({
  name: 'wishList',
  initialState: {
    data: [],
    loading:false
  },
  reducers: {
    userWishList(state, {payload}){
    state.data = payload
    },
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchWishList.fulfilled, (state, {payload})=>{
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(fetchWishList.pending, (state, {payload})=>{
      state.loading = true;
    });
  }
});
export const {userWishList} = WishListSlice.actions;
export default WishListSlice.reducer;