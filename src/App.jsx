import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';
import Bookmarks from './pages/Bookmarks';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { setBookmarks } from './store';
import API from './api/axios';

/**
 * Main Application Component
 * Handles the core routing setup, protected route redirection, 
 * and global data bootstrapping (like fetching user bookmarks on load).
 */
function App() {
  // Extract auth token from Redux to determine user's login status
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetch the user's initial bookmarks upon successful authentication
  useEffect(() => {
    const fetchAllBookmarks = async () => {
      if (token) {
        try {
          const { data } = await API.get('/bookmarks', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Hydrate the Redux store with fetched bookmarks
          dispatch(setBookmarks(data));
        } catch (error) {
          console.error('Error fetching initial bookmarks:', error);
        }
      }
    };
    fetchAllBookmarks();
  }, [token, dispatch]);

  return (
    <Router>
      {/* Global Toast Notification Configuration */}
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#161D2F',
          color: '#fff',
          border: '1px solid #5A698F'
        }
      }} />
      
      <Routes>
        {/* Public / Auth Routes (Redirects to Home if already logged in) */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
        
        {/* Protected Application Routes (Wrapped in Sidebar Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/movies" element={token ? <Movies /> : <Navigate to="/login" />} />
          <Route path="/tv-series" element={token ? <TVSeries /> : <Navigate to="/login" />} />
          <Route path="/bookmarks" element={token ? <Bookmarks /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
