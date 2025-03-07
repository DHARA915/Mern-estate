import React from 'react'
import {Link} from 'react-router-dom'

const Signup = () => {
  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign-Up</h1>
      <form action="" className='flex flex-col gap-4'>
      <input type='text' placeholder='username' className='border bg-slate-100 p-3 rounded-lg' id='username'/>  
      <input type='text' placeholder='email' className='border bg-slate-100 p-3 rounded-lg' id='email'/>  
      <input type='text' placeholder='password' className='border bg-slate-100 p-3 rounded-lg' id='password'/>  
      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
        <span className='text-blue-700'>Sign-in</span>
        </Link>
        </div>
    </div>
  )
}

export default Signup