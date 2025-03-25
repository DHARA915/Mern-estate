import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import {useSelector} from 'react-redux'
import 'swiper/css/bundle'

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../Components/Contact';


const Listingpage = () => {

    SwiperCore.use([Navigation])
  
    const [listing, setListing] = useState(null)
    const [loading, Setloading] = useState(false)
    const [error, SetError] = useState(false)
    const [copied, setCopied] = useState(false);
    const [contact,setContact] =useState(false)
    const params = useParams()

    const {currentUser}=useSelector((state)=>state.user)
    


    useEffect(() => {
        const fetchListing = async () => {
            try {
                Setloading(true)

                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if (data.success === false) {
                    SetError(true)
                    Setloading(false)
                    return;
                }
                setListing(data)
                Setloading(false)
                SetError(false)
            } catch (error) {
                SetError(true);
                Setloading(false)
            }

        }
        fetchListing()
    }, [params.listingId])


    return (
        <main>
            {
                loading && <p className='text-center my-7 text-2xl'>
                    Loading...
                </p>
            }{
                error && <Link to={'/'}>
                    <p className='text-center my-7 text-2xl text-red-500'>Something went wrong!</p>
                </Link>
            }

{
  listing && !loading && !error && (
    <div>
      <Swiper navigation className="w-full">
        {listing.imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="w-full h-[450px] bg-center bg-cover"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed right-9 top-[12%] z-10 border rounded-full w-10 h-10 flex justify-center items-center bg-slate-100 cursor-pointer'>
      <FaShare className='text-slate-500' 
      onClick={()=>{
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(()=>{
          setCopied(false);
        },2000)
      }}/>
      </div>
       {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

        <div className='flex flex-col max-w-4xl mx-auto p-3  gap-4'>
        <p className='text-2xl font-semibold'>
          {listing.name} - ${' '}
          {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
        </p>
       <p className='flex items center  gap-2 text-slate-600 my-2 text-sm'>
      <FaMapMarkerAlt 
      className='text-green-700'
      />
      {listing.address}
       </p>
       <div className='flex gap-4'>
        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
          {listing.type==='rent' ?'For Rent':'For Sale'}
        </p>
        {
          listing.offer &&(
            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </p>
          )
        }
        
       </div>
       <p className='text-slate-800'> <span className='font-semibold text-black'>Description -  {' '}</span> 
          {listing.description}
        </p>
        <ul className='flex flex-wrap gap-2 sm:gap-6 items-center text-green-900 font-semibold text-sm'>
          <li className='flex gap-2 items-center whitespace-nowrap '>
            <FaBed className='text-lg  '/> 
            {listing.bedrooms>1 ? `${listing.bedrooms} beds`:`${listing.bedrooms} bed`}
          </li>
          <li className='flex gap-2  whitespace-nowrap '>
            <FaBath className='text-lg  '/> 
            {listing.bathrooms>1 ? `${listing.bathrooms} baths`:`${listing.bedrooms} bath`}
          </li>

          <li className='flex gap-2  whitespace-nowrap '>
            <FaParking className='text-lg  '/> 
           {
            listing.parking ?'Parking Spot':'No Parking'
           }
          </li>

          <li className='flex gap-2  whitespace-nowrap '>
            <FaChair className='text-lg  '/> 
           {
            listing.furnished ?'Furnished':'Unfurnished'
           }
          </li>
        </ul>
        {
          currentUser && listing.useRef !==currentUser._id&& !contact &&(
<button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact lanlord</button>
          )
        }
        {
          contact && <Contact listing={listing}/>
        }
         
        </div>

    </div>
  )
}


        </main>
    )
}

export default Listingpage