import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

const Contact = ({listing}) => {
    const [lanlord,Setlanlord] =useState(null);
    const [message,Setmessage] =useState('')

   useEffect(()=>{
   const fetchLandlord = async ()=>{
    try{
        const res = await fetch(`/api/user/${listing.useRef}`);
        const data= await res.json()
        Setlanlord(data)
    }
    catch(error){
        console.log(error)
    }
    
   }
   fetchLandlord()
   },[listing.useRef])

   const onChange=(e)=>{
    Setmessage(e.target.value)
   }

  return (
   <>
   {
    lanlord && (
        <div className='flex flex-col gap-2' >
            <p>Contact <span className='font-semibold'>{lanlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
            <textarea placeholder='Enter your message here' name="message"  id="message" rows='2' value={message} onChange={onChange} className='w-full border p-2 rounded-lg '>

            </textarea>
            <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 '
            to={`mailto:${lanlord.email}?subject=Regarding ${listing.name} &body=${message}`}>
            Send Message
            </Link>
        </div>
    )
    
   }
   </>
  )
}

export default Contact