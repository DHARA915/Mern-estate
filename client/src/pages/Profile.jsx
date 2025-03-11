import React from 'react'
import {useSelector} from 'react-redux'

const Profile = () => {
 
  const {currentUser} = useSelector((state)=>state.user)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' action="">
        <img src={currentUser.avatar} alt="profile" className='rounded-full self-center mt-2 h-24 w-24object-cover cursor-pointer' />
        <input id='username' type='text' placeholder='username' className='border-transparent bg-white p-3 rounded-lg ' />
        <input id='email' type='text' placeholder='email' className='border-transparent bg-white p-3 rounded-lg ' />
        <input id='password'type='text' placeholder='password' className='border-transparent bg-white p-3 rounded-lg ' />
        <button className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile