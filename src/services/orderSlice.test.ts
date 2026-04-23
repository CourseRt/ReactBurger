import orderReducer, { postOrder, clearOrder, initialState } from './orderSlice';

describe('order reducer', () => {
  it('should return the initial state', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should set isLoading to true and hasError to false when postOrder is pending', () => {
    const action = { type: postOrder.pending.type };
    const state = orderReducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
  });

  it('should update orderNumber and set isLoading to false when postOrder is fulfilled', () => {
    const mockOrderNumber = 12345;
    const action = { 
      type: postOrder.fulfilled.type, 
      payload: mockOrderNumber 
    };
    const state = orderReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.orderNumber).toBe(mockOrderNumber);
  });

  it('should set hasError to true and isLoading to false when postOrder is rejected', () => {
    const action = { type: postOrder.rejected.type };
    const state = orderReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(true);
  });

  it('should clear orderNumber when clearOrder is called', () => {
    const stateWithOrder = { ...initialState, orderNumber: 999 };
    const state = orderReducer(stateWithOrder, clearOrder());
    
    expect(state.orderNumber).toBeNull();
  });
});
