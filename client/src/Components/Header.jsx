import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md  '>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
          <h1 className='font-bold text-xl sm:text-2xl flex flex-wrap'>
            <span className='text-slate-500'>Eterna</span>
            <span className='text-slate-700'>Homes</span>
          </h1>
        </Link>


        <form action="" className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
          <FaSearch className='text-slate-600' />
        </form>

        <ul className='flex gap-4 text-slate-700 font-semibold cursor-default'>
          <Link to="/"><li className='hidden sm:inline hover:underline'>Home</li></Link>
          <Link to="/about"><li className='hidden sm:inline hover:underline' >About</li>
          </Link>
          <Link to="/profile" className="flex items-center">
  {currentUser ? (
    <img
      src={currentUser.avatar || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="} 
      alt="Profile"
      className="w-8 h-8 rounded-full object-cover border border-gray-300 hover:opacity-80 transition"
      onError={(e) => {
        console.error("Image failed to load:", currentUser.avatar);
        e.target.src = "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="; // Fallback to default image
      }}
    />
  ) : (
    <span className="text-slate-700 hover:underline">Sign in</span>
  )}
</Link>

        </ul>
      </div>


    </header>
  )
}

export default Header