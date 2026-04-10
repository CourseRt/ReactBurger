import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from '../utils/types';

interface IProfileOrdersState {
  orders: IOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
}

const initialState: IProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsConnect: (state, action: PayloadAction<string>) => {}, 
    wsDisconnect: (state) => {
      state.isConnected = false;
    },
    wsConnecting: (state) => {
      state.isConnected = false;
    },
    onOpen: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    onClose: (state) => {
      state.isConnected = false;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.error = action.payload;
    },
    onMessage: (state, action: PayloadAction<{ orders: IOrder[]; total: number; totalToday: number }>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
});

export const { 
  wsConnect, 
  wsDisconnect, 
  wsConnecting, 
  onOpen, 
  onClose, 
  onError, 
  onMessage 
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
