import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signInStart, signInFailure, signInSuccess } from '../Redux/user/userSlice'

import OAuth from '../Components/OAuth'

const Signin = () => {
  const [formData, setformData] = useState({})
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },
    tap: { scale: 0.98 }
  };

  const handleOnchange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleOnsubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(241,245 , 241)] flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-center">Sign In</h1>
          </motion.div>

          <motion.div 
            className="p-6"
            variants={containerVariants}
          >
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring" }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleOnsubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <motion.label 
                  className="block text-gray-700 text-sm font-medium mb-2 pl-1"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Email
                </motion.label>
                <motion.input 
                  type="email" 
                  placeholder="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition-all"
                  id="email" 
                  onChange={handleOnchange}
                  whileFocus={{ 
                    scale: 1.01,
                    boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.5)"
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <motion.label 
                  className="block text-gray-700 text-sm font-medium mb-2 pl-1"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Password
                </motion.label>
                <motion.div
                  whileFocus={{ 
                    scale: 1.01,
                    boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.5)"
                  }}
                  className="relative"
                >
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 pr-12 shadow-sm"
                    id="password"
                    onChange={handleOnchange}
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-70 transition-all shadow-lg"
                  variants={buttonVariants}
                  whileHover={!loading ? "hover" : {}}
                  whileTap={!loading ? "tap" : {}}
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Loading...
                    </motion.span>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </motion.div>

              <motion.div className="flex items-center my-4" variants={itemVariants}>
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </motion.div>

              <OAuth />
            </form>

            <motion.div 
              className="flex gap-2 mt-6 justify-center"
              variants={itemVariants}
            >
              <p className="text-gray-600">Don't have an account?</p>
              <Link to={"/sign-up"}>
                <motion.span 
                  className="text-gray-800 font-medium hover:text-gray-900"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Signin