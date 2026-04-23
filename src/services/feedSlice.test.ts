import feedReducer, {
  initialState,
  wsDisconnect,
  onOpen,
  onClose,
  onError,
  onMessage
} from './feedSlice';
import { IOrder } from '../utils/types';

describe('feed reducer', () => {
  const mockOrders: IOrder[] = [
    {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Бургер',
      createdAt: '2023',
      updatedAt: '2023',
      number: 123
    }
  ];

  it('should return the initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle onOpen', () => {
    const state = feedReducer(initialState, onOpen());
    expect(state.isConnected).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle onClose', () => {
    const stateWithConnection = { ...initialState, isConnected: true };
    const state = feedReducer(stateWithConnection, onClose());
    expect(state.isConnected).toBe(false);
  });

  it('should handle onError', () => {
    const errorText = 'Connection failed';
    const state = feedReducer(initialState, onError(errorText));
    expect(state.isConnected).toBe(false);
    expect(state.error).toBe(errorText);
  });

  it('should handle onMessage', () => {
    const payload = {
      orders: mockOrders,
      total: 1000,
      totalToday: 10
    };
    const state = feedReducer(initialState, onMessage(payload));
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(1000);
    expect(state.totalToday).toBe(10);
  });

  it('should handle wsDisconnect', () => {
    const stateWithConnection = { ...initialState, isConnected: true };
    const state = feedReducer(stateWithConnection, wsDisconnect());
    expect(state.isConnected).toBe(false);
  });
});
