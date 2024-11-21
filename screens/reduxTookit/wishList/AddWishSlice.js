import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

// import services from '../../../services';
// import { apiRoot } from '../../../constant';

// export const featchAddWishList = createAsyncThunk('wish/addWishList', 
//   async (data)=>{
//     const response = await services.post(apiRoot.addToWishList, data);
//     alert(response.message)
//     if(response.status=="success"){
//       return response.data;
//     } else {
//       return [];
//     }
// })

const AddWishSlice = createSlice({
    name:'addWishlist',
    initialState:{
        data:[]
    },
    reducers:{
        addToWishlist(state, action){
            const {product_id} = action.payload;
            const find = state.data.find(item=>item.product_id == product_id);

            if(find){
                const productIndex = state.data.findIndex(item=>item.product_id == product_id);

                if (productIndex != -1){ 
                    state.data.splice(productIndex, 1);
                }

            } else{
                let tempData = state.data
                tempData.push(action.payload);
                state.data = tempData
            }
        },
    },

    // extraReducers:(builder)=>{
    //     builder.addCase(featchAddWishList.fulfilled, (state, {payload})=>{
    //       state.data = payload;
    //     });
    //   }
});

export const {addToWishlist} = AddWishSlice.actions
export default AddWishSlice.reducer