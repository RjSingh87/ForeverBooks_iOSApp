import { createSlice } from '@reduxjs/toolkit';
const initialState = []
const ProductSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        addMyProduct(state, action) {
            state.push(action.payload)
        },
        inCrement(state, { payload }) {
            return state.map(item => item.id === payload ? {
                ...item, qty: item.qty + 1
            } : item
            )
        },
        deCrement(state, { payload }) {
            return state.map(item => item.id === payload ? {
                ...item, qty: item.qty - 1
            } : item
            )
        },
        interNetError(state, { payload }) {
            state.push(payload)

        }
    }
});
export const { addMyProduct, inCrement, deCrement, interNetError } = ProductSlice.actions
export default ProductSlice.reducer