import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    setBookmarks: (state, action) => {
      state.items = action.payload;
    },
    addBookmark: (state, action) => {
      state.items.push(action.payload);
    },
    removeBookmark: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export const { setBookmarks, addBookmark, removeBookmark } = bookmarkSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    bookmarks: bookmarkSlice.reducer,
  },
});

export default store;
