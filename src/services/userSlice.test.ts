import userReducer, { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUser, 
  updateUser,
  setAuthChecked,
  setUser
} from './userSlice';

describe('user reducer', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null,
  };

  const mockUser = { email: 'test@test.ru', name: 'Ivan' };

  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setAuthChecked', () => {
    const state = userReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle setUser', () => {
    const state = userReducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
  });

  it('should handle registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle logoutUser.fulfilled', () => {
    const stateWithUser = { ...initialState, user: mockUser };
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(stateWithUser, action);
    expect(state.user).toBeNull();
  });

  it('should handle getUser.fulfilled', () => {
    const action = { type: getUser.fulfilled.type, payload: { user: mockUser } };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle getUser.rejected', () => {
    const action = { type: getUser.rejected.type };
    const state = userReducer({ ...initialState, user: mockUser }, action);
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle updateUser.fulfilled', () => {
    const action = { type: updateUser.fulfilled.type, payload: { user: mockUser } };
    const state = userReducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });
});
