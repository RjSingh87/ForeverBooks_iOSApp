import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiRoot} from '../../../constant';
import services from '../../../services';
export const fetchProfileData = createAsyncThunk('fetchProfileData', 
  
  async (data)=>{
    const response = await services.post(apiRoot.getCustomerProfileData, data);
    if(response.status=="success"){
      return response.data;
    } else {
        return {}
    }
})
const userProfileDetail = createSlice({
  name: 'profileData',
  initialState: {
    data: {},
    isLoading:false,
    isError:false
  },
  
  extraReducers:(builder)=>{
    builder.addCase(fetchProfileData.pending, (state, {payload})=>{
      state.isLoading = true;
    });

    builder.addCase(fetchProfileData.fulfilled, (state, {payload})=>{
      state.data = payload;
      state.isLoading = false
    });
    builder.addCase(fetchProfileData.rejected, (state, {payload})=>{
      state.isLoading = false,
      state.isError = true
      state.data = {};
    });
  }
});
// export const {addProfileData} = userProfileDetail.actions;
export default userProfileDetail.reducer;