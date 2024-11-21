import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import services from '../../../services';
import { apiRoot } from '../../../constant';

export const featchSingleProduct = createAsyncThunk('prodect/singleProduct', 
  async (data)=>{
    const response = await services.post(apiRoot.getSingleProductDetail, data);
    if(response.status=="success"){
      return response.data;
    } else {
      return [];
    }
})

const SingleProductSlice = createSlice({
    name:'singleProduct',
    initialState:{
        data:null,
        loading:false
    },
    reducers:{
        getSingleProduct(state, action){
            state.data = state
        },
    },

    extraReducers:(builder)=> {
        builder.addCase(featchSingleProduct.fulfilled,(state, {payload})=>{
          state.data = payload;
          state.loading=false
        });

        builder.addCase(featchSingleProduct.pending, (state, {payload})=>{
            state.loading = true;
          });
      }
});

export const {addToWishlist} = SingleProductSlice.actions
export default SingleProductSlice.reducer