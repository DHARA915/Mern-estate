import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

const Signup = () => {
  const [formData, setformData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigte = useNavigate();
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
      setLoading(true)
      const res = await fetch('/api/auth/signup',
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
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigte('/sign-in')
    }catch(error){
  setLoading(false)
  setError(error.message)
    }
    
  };

  return (
    <div className='p-3 mx-auto max-w-lg'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign-Up</h1>

      <form onSubmit={handleOnsubmit} action="" className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border bg-slate-100 p-3 rounded-lg' id='username' onChange={handleOnchange} />
        <input type='text' placeholder='email' className='border bg-slate-100 p-3 rounded-lg' id='email' onChange={handleOnchange} />
        <input type='text' placeholder='password' className='border bg-slate-100 p-3 rounded-lg' id='password' onChange={handleOnchange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {
            loading?'Loading...' : 'Sign Up'
          }
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign-in</span>
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

export default Signup