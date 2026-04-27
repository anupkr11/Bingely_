import React from 'react';
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
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllBookmarks = async () => {
      if (token) {
        try {
          const { data } = await axios.get('http://localhost:5000/api/bookmarks', {
            headers: { Authorization: `Bearer ${token}` }
          });
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
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#161D2F',
          color: '#fff',
          border: '1px solid #5A698F'
        }
      }} />
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
        
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
