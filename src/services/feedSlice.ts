import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from '../utils/types';

interface IFeedState {
  orders: IOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
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
} = feedSlice.actions;

export default feedSlice.reducer;
