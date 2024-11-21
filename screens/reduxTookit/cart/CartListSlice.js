import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRoot } from '../../../constant';
import services from '../../../services';
export const fetchCardList = createAsyncThunk('cart/cartApi', 
  async (data)=>{
    const response = await services.post(apiRoot.cartList, data);
    if(response.status=="success"){
      return response.data;
    } else {
      return [];
    }
})
const cartListSlice = createSlice({
  name: 'cart',
  initialState: {
    data: [],
    loading:false
  },
  // reducers: {
  //   userCartList(state, {payload}){
  //     state.data = payload
  //   },
  // },
  extraReducers:(builder)=>{
    builder.addCase(fetchCardList.fulfilled, (state, {payload})=>{
      state.data = payload;
      state.loading = false;
    });
    builder.addCase(fetchCardList.pending, (state, {payload})=>{
      state.loading = true;
    });
  }
});
export const {userCartList} = cartListSlice.actions;
export default cartListSlice.reducer;