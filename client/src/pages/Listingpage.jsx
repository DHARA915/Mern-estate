import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import {useSelector} from 'react-redux'
import 'swiper/css/bundle'
import { motion, AnimatePresence } from 'framer-motion';
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
    SwiperCore.use([Navigation, Autoplay]);
  
    const [listing, setListing] = useState(null)
    const [loading, Setloading] = useState(false)
    const [error, SetError] = useState(false)
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false)
    const params = useParams()

    const {currentUser} = useSelector((state)=>state.user)
    
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { 
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    }

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
            {loading && (
                <motion.div 
                    className="text-center my-7 text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex justify-center">
                        <motion.div 
                            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"
                            animate={{ 
                                rotate: 360,
                                transition: { 
                                    repeat: Infinity, 
                                    duration: 1,
                                    ease: "linear"
                                }
                            }}
                        />
                    </div>
                </motion.div>
            )}
            
            {error && (
                <Link to={'/'}>
                    <motion.p 
                        className="text-center my-7 text-2xl text-red-500 font-medium"
                        initial={{ scale: 0.9 }}
                        animate={{ 
                            scale: 1,
                            transition: { 
                                type: 'spring', 
                                stiffness: 200,
                                damping: 10
                            }
                        }}
                    >
                        Something went wrong!
                    </motion.p>
                </Link>
            )}

            {listing && !loading && !error && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="pb-12"
                >
                    <motion.div 
                        className="relative"
                        variants={fadeIn}
                    >
                        <Swiper 
                            navigation 
                            autoplay={{ delay: 3000 }}
                            className="w-full rounded-lg shadow-2xl"
                        >
                            {listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div
                                        className="w-full h-[500px] bg-center bg-cover rounded-lg"
                                        style={{ backgroundImage: `url(${url})` }}
                                    ></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        
                        <motion.div 
                            className="fixed right-9 top-[12%] z-10 border border-slate-700 rounded-full w-10 h-10 flex justify-center items-center bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-slate-100 transition-colors shadow-lg"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000)
                            }}
                        >
                            <FaShare className="text-slate-800" />
                        </motion.div>
                        
                        <AnimatePresence>
                            {copied && (
                                <motion.p 
                                    className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-800 text-white p-2 px-3 font-medium shadow-lg"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    Link copied!
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <div className="flex flex-col max-w-4xl mx-auto p-3 gap-6 mt-8">
                        <motion.div variants={itemVariants}>
                            <h1 className="text-4xl font-bold text-slate-900">
                                {listing.name} - ${' '}
                                {listing.offer
                                    ? listing.discountPrice.toLocaleString('en-US')
                                    : listing.regularPrice.toLocaleString('en-US')}
                                {listing.type === 'rent' && ' / month'}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-600 my-2">
                                <FaMapMarkerAlt className="text-slate-800" />
                                <span className="font-medium">{listing.address}</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants} 
                            className="flex gap-4"
                        >
                            <motion.p 
                                className="bg-gradient-to-r from-slate-800 to-slate-700 w-full max-w-[200px] text-white text-center p-2 rounded-md shadow-lg hover:shadow-xl transition-all"
                                whileHover={{ y: -2 }}
                            >
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </motion.p>
                            {listing.offer && (
                                <motion.p 
                                    className="bg-gradient-to-r from-emerald-700 to-emerald-600 w-full max-w-[200px] text-white text-center p-2 rounded-md shadow-lg hover:shadow-xl transition-all"
                                    whileHover={{ y: -2 }}
                                >
                                    ${+listing.regularPrice - +listing.discountPrice} OFF
                                </motion.p>
                            )}
                        </motion.div>

                        <motion.p 
                            variants={itemVariants} 
                            className="text-slate-700 leading-relaxed text-lg"
                        >
                            <span className="font-semibold text-slate-900">Description:</span> {' '}
                            {listing.description}
                        </motion.p>

                        <motion.ul 
                            variants={itemVariants}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                            <motion.li 
                                className="flex gap-2 items-center whitespace-nowrap bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                whileHover={{ y: -3 }}
                            >
                                <FaBed className="text-lg text-slate-800" /> 
                                <span className="text-slate-700 font-medium">
                                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                                </span>
                            </motion.li>
                            <motion.li 
                                className="flex gap-2 items-center whitespace-nowrap bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                whileHover={{ y: -3 }}
                            >
                                <FaBath className="text-lg text-slate-800" /> 
                                <span className="text-slate-700 font-medium">
                                    {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                                </span>
                            </motion.li>
                            <motion.li 
                                className="flex gap-2 items-center whitespace-nowrap bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                whileHover={{ y: -3 }}
                            >
                                <FaParking className="text-lg text-slate-800" /> 
                                <span className="text-slate-700 font-medium">
                                    {listing.parking ? 'Parking Spot' : 'No Parking'}
                                </span>
                            </motion.li>
                            <motion.li 
                                className="flex gap-2 items-center whitespace-nowrap bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                whileHover={{ y: -3 }}
                            >
                                <FaChair className="text-lg text-slate-800" /> 
                                <span className="text-slate-700 font-medium">
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </span>
                            </motion.li>
                        </motion.ul>

                        {currentUser && listing.useRef !== currentUser._id && !contact && (
                            <motion.button 
                                onClick={() => setContact(true)}
                                className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg uppercase hover:opacity-90 p-4 shadow-xl hover:shadow-2xl transition-all font-medium tracking-wide"
                                whileHover={{ 
                                    y: -2,
                                    scale: 1.01,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Contact Landlord
                            </motion.button>
                        )}
                        
                        {contact && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Contact listing={listing} />
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </main>
    )
}

export default Listingpage