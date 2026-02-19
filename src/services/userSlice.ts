import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, deleteCookie, getCookie } from '../utils/cookie'; 
import { BASE_URL } from '../utils/constants';
import { fetchWithRefresh } from '../utils/api';

interface IUser {
  email: string;
  name: string;
}

interface IUserState {
  user: IUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: { email: string; password: string; name: string }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) return Promise.reject(json.message);
    
    setCookie('accessToken', json.accessToken);
    localStorage.setItem('refreshToken', json.refreshToken);
    return json.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) return Promise.reject(json.message);
    
    setCookie('accessToken', json.accessToken);
    localStorage.setItem('refreshToken', json.refreshToken);
    return json.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });
  const json = await res.json();
  if (json.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

export const getUser = createAsyncThunk('user/get', async () => {
  return await fetchWithRefresh(`${BASE_URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    },
  });
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: { email?: string; password?: string; name?: string }) => {
    return await fetchWithRefresh(`${BASE_URL}/auth/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getCookie('accessToken') || ''
      },
      body: JSON.stringify(data),
    });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user; 
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления';
      })
    },
});

export const { setAuthChecked, setUser } = userSlice.actions;
export default userSlice.reducer;
