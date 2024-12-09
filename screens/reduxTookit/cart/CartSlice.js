import { createSlice } from '@reduxjs/toolkit';

const cardSlice = createSlice({
    name: 'add_cart',
    initialState: {
        data: []
    },
    reducers: {
        addToCart(state, { payload }) {
            const { product_id } = payload
            const find = state.data.find(item => item.product_id == product_id);
            if (find) {
                const productIndex = state.data.findIndex(item => item.product_id == product_id);

                if (productIndex != -1) {
                    state.data.splice(productIndex, 1);
                }

            } else {
                let tempData = state.data
                tempData.push(payload);
                state.data = tempData
            }
        },

        decrement(state, { payload }) {
            return state.map(item => item.id === payload ? {
                ...item, qty: item.qty - 1
            } : item
            )
        },

    }
});
export const { addToCart, removeToCart, increment, decrement } = cardSlice.actions
export default cardSlice.reducer