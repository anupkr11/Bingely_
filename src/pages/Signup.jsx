import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store';
import axios from 'axios';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }

    dispatch(loginStart());
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { 
        firstName, 
        lastName, 
        email, 
        password 
      });
      dispatch(loginSuccess(data));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed';
      dispatch(loginFailure(msg));
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-dark-blue flex flex-col items-center pt-20 px-4">
      <Clapperboard className="text-primary w-8 h-8 mb-20" />
      
      <div className="bg-semi-dark-blue p-8 md:p-12 rounded-3xl w-full max-w-[400px]">
        <h1 className="text-3xl mb-10 font-light">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="First Name"
            className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Repeat password"
            className="w-full py-4 px-4 bg-transparent border-b border-grey-blue focus:border-pure-white outline-none transition-colors"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-primary text-xs mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-primary text-pure-white rounded-lg mt-4 hover:bg-pure-white hover:text-dark-blue transition-colors font-light"
          >
            Create an account
          </button>
        </form>

        <p className="text-center mt-6 text-pure-white/75 font-light">
          Already have an account?{' '}
          <NavLink to="/login" className="text-primary hover:underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
