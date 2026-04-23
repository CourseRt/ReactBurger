import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL, checkResponse } from '../utils/constants';
import { fetchWithRefresh } from '../utils/api';
import { getCookie } from '../utils/cookie';

interface IOrderState {
  orderNumber: number | null;
  isLoading: boolean;
  hasError: boolean;
}

export const initialState: IOrderState = {
  orderNumber: null,
  isLoading: false,
  hasError: false,
};

interface IOrderResponse {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
}

export const postOrder = createAsyncThunk<number, string[]>(
  'order/postOrder',
  async (ingredientIds) => {
    const data = await fetchWithRefresh<IOrderResponse>(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('accessToken') || ''
      },
      body: JSON.stringify({
        ingredients: ingredientIds,
      }),
    });
    return data.order.number;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(postOrder.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
