import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRoot } from '../../../constant';
import services from '../../../services';
export const fetchAddressList = createAsyncThunk('addressApi', 
  async (data)=>{
    const response = await services.post(apiRoot.getSavedAddress, data);
    if(response.status=="success"){
      return response.data;
    } else {
      return [];
    }
})
const AddressListSlice = createSlice({
  name: 'addressList',
  initialState: {
    data: [],
    loading:false
  },

  reducers: {
    userAddressList(state, {payload}) {
      state.data.push(payload);
    },
  },

  extraReducers:(builder)=>{
      builder.addCase(fetchAddressList.pending, (state, {payload})=>{
      state.loading = true;
    });

    builder.addCase(fetchAddressList.fulfilled, (state, {payload})=>{
      state.data = payload;
      state.loading = false
    });
    builder.addCase(fetchAddressList.rejected, (state, {payload})=>{
      state.data = [];
      state.loading = false
    });
  }
});

export const {userAddressList} = AddressListSlice.actions;
export default AddressListSlice.reducer;