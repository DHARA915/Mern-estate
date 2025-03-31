import React, { useEffect, useState } from 'react';
import { FaSearch, FaHome, FaInfoCircle, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={` w-full h-[80px] z-50 bg-slate-200 shadow-md transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-3'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
          <motion.h1 
            className='font-bold text-xl sm:text-2xl sm:flex-row flex flex-col flex-wrap '
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className='text-slate-500'>Eterna</span>
            <span className='text-slate-700'>Homes</span>
          </motion.h1>
        </Link>

        <motion.form 
          onSubmit={handleSubmit} 
          className='bg-slate-100 p-2 rounded-lg flex items-center shadow-sm'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input 
            value={searchTerm} 
            type="text" 
            placeholder='Search...' 
            className='bg-transparent focus:outline-none w-24 sm:w-64 px-2 text-slate-700'
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSearch className='text-slate-600 hover:text-slate-800 transition-colors' />
          </motion.button>
        </motion.form>

        <ul className='flex gap-4 text-slate-700 font-semibold cursor-default items-center'>
          <Link to="/">
            <motion.li 
              className='hidden sm:flex items-center gap-1 hover:text-slate-900 transition-colors'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHome className="text-sm" />
              <span>Home</span>
            </motion.li>
          </Link>
          <Link to="/about">
            <motion.li 
              className='hidden sm:flex items-center gap-1 hover:text-slate-900 transition-colors'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInfoCircle className="text-sm" />
              <span>About</span>
            </motion.li>
          </Link>
          <Link to="/profile">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentUser ? (
                <motion.img
                  src={currentUser.avatar || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="} 
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 hover:opacity-80 transition"
                  onError={(e) => {
                    console.error("Image failed to load:", currentUser.avatar);
                    e.target.src = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.span 
                  className="text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaUser className="text-sm" />
                  <span className="hidden sm:inline">Sign in</span>
                </motion.span>
              )}
            </motion.div>
          </Link>
        </ul>
      </div>
    </motion.header>
  );
};

export default Header;