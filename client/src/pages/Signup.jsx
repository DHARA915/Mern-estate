import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../Components/OAuth'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign-Up</h1>

      <form onSubmit={handleOnSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='Username' className='border bg-slate-100 p-3 rounded-lg' id='username' onChange={handleOnChange} />
        <input type='text' placeholder='Email' className='border bg-slate-100 p-3 rounded-lg' id='email' onChange={handleOnChange} />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border bg-slate-100 p-3 rounded-lg w-full pr-10"
            id="password"
            onChange={handleOnChange}
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign-in</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  );
};

export default Signup;
