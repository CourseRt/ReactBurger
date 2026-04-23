import profileOrdersReducer, {
  wsDisconnect,
  onOpen,
  onClose,
  onError,
  onMessage,
  initialState
} from './profileOrdersSlice';
import { IOrder } from '../utils/types';

describe('profileOrders reducer', () => {
  const mockOrders: IOrder[] = [
    {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Мой заказ',
      createdAt: '2023',
      updatedAt: '2023',
      number: 777
    }
  ];

  it('should return the initial state', () => {
    expect(profileOrdersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle onOpen', () => {
    const state = profileOrdersReducer(initialState, onOpen());
    expect(state.isConnected).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle onError', () => {
    const errorText = 'WS Error';
    const state = profileOrdersReducer(initialState, onError(errorText));
    expect(state.isConnected).toBe(false);
    expect(state.error).toBe(errorText);
  });

  it('should handle onMessage', () => {
    const payload = {
      orders: mockOrders,
      total: 1,
      totalToday: 1
    };
    const state = profileOrdersReducer(initialState, onMessage(payload));
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(1);
    expect(state.totalToday).toBe(1);
  });

  it('should handle onClose', () => {
    const stateWithConnection = { ...initialState, isConnected: true };
    const state = profileOrdersReducer(stateWithConnection, onClose());
    expect(state.isConnected).toBe(false);
  });

  it('should handle wsDisconnect', () => {
    const stateWithConnection = { ...initialState, isConnected: true };
    const state = profileOrdersReducer(stateWithConnection, wsDisconnect());
    expect(state.isConnected).toBe(false);
  });
});
