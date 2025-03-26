import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle'
import ListingItem from '../Components/ListingItem';


const Home = () => {

  const [offerlistings, setOfferlistings] = useState([])
  const [saleListings, setSlaelistings] = useState([])
  const [rentlistings, setRentlisting] = useState([])

  SwiperCore.use([Navigation])

  console.log(offerlistings)

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json();
        setOfferlistings(data)
        fetchRentListings()
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`)
        const data = await res.json();
        setRentlisting(data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`)
        const data = await res.json();
        setSlaelistings(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListing();
  }, [])

  return (
    <div>


      {/* Top */}
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span><br />
          place with ease
        </h1>
        <div className='text-gray-500 text-xs sm:text-sm'>
          EternaHomes will help you find your home fast ,  easy and comfortable.
          <br />Our expert support are always available.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {
          offerlistings && offerlistings.length > 0 &&
          offerlistings.map((listing) => (
            <SwiperSlide>
              <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className='h-[500px]' key={listing._id}>
              
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>


      {/* listing results for offer , sale and rent */}
     
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-4 my-10'>
      {
        offerlistings && offerlistings.length > 0 &&(
        <div>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'> Recent offers</h2>
            <Link className='text-blue-800 hover:underline font-semibold' to={`/search?offer=true`}>show more offers</Link>
          </div>
          <div className='flex flex-wrap gap-3 '>
            {
              offerlistings.map((listing)=>(
             <ListingItem listing={listing} key={listing._id} />
              ))
            }
          </div>
          </div>
        )
      }
      {
        rentlistings && rentlistings.length > 0 &&(
        <div>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
            <Link className='text-blue-800 hover:underline font-semibold' to={`/search?type=rent`}>show more places for rent</Link>
          </div>
          <div className='flex flex-wrap gap-3 '>
            {
              rentlistings.map((listing)=>(
             <ListingItem listing={listing} key={listing._id} />
              ))
            }
          </div>
          </div>
        )
      }
      {
        saleListings && saleListings.length > 0 &&(
        <div>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'> Recent places for sale</h2>
            <Link className='text-blue-800 hover:underline font-semibold' to={`/search?type=sale`}>show more places for sale</Link>
          </div>
          <div className='flex flex-wrap gap-3 '>
            {
              saleListings.map((listing)=>(
             <ListingItem listing={listing} key={listing._id} />
              ))
            }
          </div>
          </div>
        )
      }
      </div>

    </div>
  )
}

export default Home