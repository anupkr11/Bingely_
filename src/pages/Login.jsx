import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ✅ added
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start animation
    dispatch(loginStart());

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      dispatch(loginSuccess(data));

      // small delay for smooth UX
      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch(loginFailure(msg));
      setError(msg);
      setLoading(false); // stop animation on error
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue flex flex-col items-center pt-20 px-4">
      <Clapperboard className="text-primary w-8 h-8 mb-20" />
      
      <div className="bg-semi-dark-blue p-8 md:p-12 rounded-3xl w-full max-w-[400px]">
        <h1 className="text-3xl mb-10 font-light">Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-primary text-xs mt-2">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg mt-4 font-light transition-all
              ${loading 
                ? 'bg-grey-blue cursor-not-allowed text-white/70' 
                : 'bg-primary text-pure-white hover:bg-pure-white hover:text-dark-blue cursor-pointer'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1">
                <span className="animate-pulse">Logging in</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            ) : (
              'Login to your account'
            )}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center mt-6 text-pure-white/75 font-light">
          Don't have an account?{' '}
          <NavLink to="/signup" className="text-primary hover:underline">
            Sign Up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;