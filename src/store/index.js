import { configureStore, createSlice } from '@reduxjs/toolkit';

/**
 * Authentication Slice
 * Manages the user's login state, JWT token, and authentication errors.
 * Persists basic user data and token in localStorage.
 */
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
      // Persist auth data on successful login
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
      // Clear persistence on logout
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

/**
 * Bookmarks Slice
 * Manages the list of media items the user has saved.
 */
const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    // Populate the entire bookmarks list (e.g., on initial app load)
    setBookmarks: (state, action) => {
      state.items = action.payload;
    },
    // Add a single new bookmark to the state array
    addBookmark: (state, action) => {
      state.items.push(action.payload);
    },
    // Remove a bookmark by its ID
    removeBookmark: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

// Export action creators for use in components
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export const { setBookmarks, addBookmark, removeBookmark } = bookmarkSlice.actions;

/**
 * Configure the global Redux store
 * Combines the auth and bookmarks slices into a single state tree
 */
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    bookmarks: bookmarkSlice.reducer,
  },
});

export default store;
