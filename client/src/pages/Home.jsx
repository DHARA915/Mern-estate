import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation ,Autoplay,Pagination} from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi'; // Feather icon arrow

import SwiperCore from 'swiper';
import 'swiper/css/bundle'
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import ListingItem from '../Components/ListingItem';
import { motion } from 'framer-motion';

const Home = () => {
  const [offerlistings, setOfferlistings] = useState([]);
  const [saleListings, setSlaelistings] = useState([]);
  const [rentlistings, setRentlisting] = useState([]);

  SwiperCore.use([Navigation,Autoplay]);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferlistings(data);
        fetchRentListings();
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentlisting(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSlaelistings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListing();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <motion.div 
        className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1
          className='text-slate-800 font-bold text-3xl lg:text-6xl'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Find your next <span className='text-slate-600'>perfect</span><br />
          place with ease
        </motion.h1>

        <motion.div
          className='text-slate-500 text-sm sm:text-base max-w-2xl'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          EternaHomes will help you find your home fast, easy, and comfortable.
          <br />Our expert support is always available.
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-start"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <Link 
            to={"/search"} 
            className="relative bg-gradient-to-r from-slate-950 to-slate-700 text-white px-8 py-3 rounded-lg font-semibold text-sm sm:text-base w-fit hover:shadow-lg transition-all duration-300 group overflow-hidden inline-flex items-center gap-2"
          >
            <span>Let's get started</span>
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: 5 }}
              transition={{ 
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8
              }}
            >
              <FiArrowRight className="text-lg" />
            </motion.span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
            />
            <motion.span
              className="absolute top-0 left-0 w-full h-0.5 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              initial={{ scaleX: 0 }}
            />
          </Link>

          {/* Mobile-only About button */}
          <Link
            to="/about"
            className="sm:hidden relative border border-slate-700 text-slate-700 px-6 py-3 rounded-lg font-semibold text-sm w-fit hover:shadow-lg transition-all duration-300 group overflow-hidden"
          >
            <span>About Us</span>
            <motion.span
              className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Rest of your existing code remains the same */}
      <Swiper navigation>
        {offerlistings && offerlistings.length > 0 &&
          offerlistings.map((listing) => (
            <SwiperSlide>
              <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className='h-[500px]' key={listing._id}>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listings Section */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-4 my-10'>
        {/* Offers */}
        {offerlistings && offerlistings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-900 mb-2'> Recent offers</h2>
              <Link  className="bg-gradient-to-r from-slate-950 to-slate-700  text-white px-2 py-2 rounded-lg font-semibold text-sm sm:text-base w-fit hover:shadow-md transition-all duration-300" to={`/search?offer=true`}>show more offers</Link>
            </div>
            <div className='flex mt-7 flex-wrap gap-3'>
              {offerlistings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Rent Listings */}
        {rentlistings && rentlistings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-900 mb-2'>Recent places for rent</h2>
              <Link className="bg-gradient-to-r from-slate-950 to-slate-700  text-white px-2 py-2 rounded-lg font-semibold text-sm sm:text-base w-fit hover:shadow-md transition-all duration-300" to={`/search?type=rent`}>show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-3 mt-7'>
              {rentlistings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Sale Listings */}
        {saleListings && saleListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-900 mb-2'> Recent places for sale</h2>
              <Link className="bg-gradient-to-r from-slate-950 to-slate-700  text-white px-2 py-2 rounded-lg font-semibold text-sm sm:text-base w-fit hover:shadow-md transition-all duration-300" to={`/search?type=sale`}>show more places for sale</Link>
            </div>
            <div className='flex flex-wrap mt-7 gap-3'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <motion.div 
        className="bg-gradient-to-r from-slate-800 to-slate-700 py-16 mt-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-3 text-center">
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to find your dream home?
          </motion.h2>
          
          <motion.p 
            className="text-slate-200 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of happy homeowners who found their perfect place with EternaHomes.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/search" 
              className="bg-white text-slate-800 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors duration-300 inline-block hover:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Listings
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home;