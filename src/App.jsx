import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Movies from './pages/Movies';
import TVSeries from './pages/TVSeries';
import Bookmarks from './pages/Bookmarks';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

function App() {
  const { token } = useSelector((state) => state.auth);

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
