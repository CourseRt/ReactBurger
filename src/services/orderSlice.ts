import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (ingredientIds: string[]) => {
    const res = await fetch('https://norma.education-services.ru/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });
    const data = await res.json();
    return data.order.number;
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
