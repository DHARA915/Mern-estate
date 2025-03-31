import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc'
import { app } from '../firebase'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../Redux/user/userSlice.js'
import {useNavigate} from 'react-router-dom'

const OAuth = () => {

 const nevigate = useNavigate()
const dispatch =useDispatch()
 const handleGoogleClick= async()=>{
  try{
      const provider = new GoogleAuthProvider()
      const auth= getAuth(app)

      const result = await signInWithPopup(auth,provider)
     const res = await fetch('/api/auth/google',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            name:result.user.displayName,
            email:result.user.email,
            photo:result.user.photoURL
        }),
     })
     const data = await res.json();
     dispatch(signInSuccess(data))
     nevigate("/")


  }catch(error){
    console.log('Could not sign in with google',error)
  }
 }

  return (
<motion.button
                  type="button"
                  onClick={handleGoogleClick}
                  className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-3"
                  whileHover={{ 
                    y: -2,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                 <FcGoogle/>
                  Continue with Google
                </motion.button>  )
}

export default OAuth