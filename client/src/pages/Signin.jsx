import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInStart,signInFailure,signInSuccess } from '../Redux/user/userSlice'

const Signin = () => {
  const [formData, setformData] = useState({})
  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const {loading,error} = useSelector((state)=>state.user)
  const navigte = useNavigate();
  const dispatch=useDispatch()
  const handleOnchange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  console.log(formData)


  const handleOnsubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(signInStart)
      const res = await fetch('/api/auth/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return
      }
      dispatch(signInSuccess(data))
      navigte('/')
    }catch(error){
 dispatch(signInFailure(error.message))
  setError(error.message)
    }
    
  };

  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign-in</h1>

      <form onSubmit={handleOnsubmit} action="" className='flex flex-col gap-4'>
       
        <input type='text' placeholder='email' className='border bg-slate-100 p-3 rounded-lg' id='email' onChange={handleOnchange} />
        <input type='text' placeholder='password' className='border bg-slate-100 p-3 rounded-lg' id='password' onChange={handleOnchange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {
            loading?'Loading...' : 'Sign in'
          }
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Do not have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign-up</span>
        </Link>
      </div>
      {
        error && <p className='text-red-700 mt-5'>
          {error}
        </p>
      }
    </div>
  )
}

export default Signin