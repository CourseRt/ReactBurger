import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL, checkResponse } from '../utils/constants';

export const postOrder = createAsyncThunk(
  'order/postOrder',
  (ingredientIds: string[]) => {
    return fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: ingredientIds,
      }),
    })
      .then(checkResponse)
      .then((data: any) => data.order.number);
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: { orderNumber: null as number | null, isLoading: false, hasError: false },
  reducers: {
    clearOrder: (state) => { state.orderNumber = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => { state.isLoading = true; state.hasError = false; })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(postOrder.rejected, (state) => { state.isLoading = false; state.hasError = true; });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
