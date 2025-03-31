import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiTrash2, FiEdit, FiHome, FiPlusCircle } from 'react-icons/fi';
import { FaRegSadTear } from 'react-icons/fa';
import { GiHouseKeys } from 'react-icons/gi';

const ShowListing = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const controls = useAnimation();

  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id || JSON.parse(JSON.parse(localStorage.getItem('persist:root'))?.user || '{}')?.currentUser?._id;

  // Format price with commas after every 3 digits
  const formatPrice = (price) => {
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '';
  };

  // Filter listings based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(listings.filter(listing => listing.type === activeTab));
    }
  }, [activeTab, listings]);

  const handleDeleteClick = (listingId) => {
    setListingToDelete(listingId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      await controls.start({
        scale: 0.9,
        opacity: 0,
        transition: { duration: 0.3 }
      });

      const res = await fetch(`/api/listing/delete/${listingToDelete}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to delete listing');
      }

      setListings((prev) => prev.filter((listing) => listing._id !== listingToDelete));
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setShowModal(false);
      setListingToDelete(null);
      await controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.3 }
      });
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setListingToDelete(null);
  };

  useEffect(() => {
    const fetchListings = async () => {
      if (!userId) {
        setError('User not found!');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/listing/${userId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Failed to fetch listings');
        }

        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f1f5f1]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        className="mb-8"
      >
        <GiHouseKeys className="text-6xl text-slate-700" />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-slate-800 mb-2"
      >
        Loading Your Listings
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-600"
      >
        Gathering your properties...
      </motion.p>
    </div>
  );

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen bg-[#f1f5f1] p-6 text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.6 }}
        >
          <FaRegSadTear className="text-6xl text-slate-700 mb-6" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h2>
        <p className="text-slate-600 mb-8 max-w-md">{error}</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/sign-in" 
            className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Re-authenticate
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f1] pb-20">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="pt-12 pb-16 px-6 text-center"
      >
        <motion.div
          whileHover={{ rotate: 5 }}
          className="inline-block mb-6"
        >
          <GiHouseKeys className="text-5xl text-slate-800" />
        </motion.div>
        <h1 className="text-5xl font-bold text-slate-800 mb-4">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500">Property Listings</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Manage all your property listings in one place
        </p>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8"
        >
          <Link
            to="/create-listing"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-full font-medium shadow-lg hover:shadow-slate-500/30 transition-all"
          >
            <FiPlusCircle className="mr-2" />
            Add New Property
          </Link>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            {['all', 'rent', 'sale'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-slate-800 to-slate-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiHome className="text-6xl text-slate-400 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Listings Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              {activeTab === 'all' 
                ? "You haven't created any listings yet."
                : `No ${activeTab} listings found.`}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/create-listing"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-600 text-white rounded-full font-medium shadow-lg hover:shadow-slate-500/30 transition-all"
              >
                Create New Listing
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 relative group"
                >
                  {/* Listing Type Badge (Rent/Sale) */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 right-4 z-10"
                  >
                    <div className={`flex items-center text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                      listing.type === 'rent' 
                        ? 'bg-gradient-to-r from-slate-600 to-slate-500' 
                        : 'bg-gradient-to-r from-slate-800 to-slate-700'
                    }`}>
                      {listing.type === 'rent' ? 'RENT' : 'SALE'}
                    </div>
                  </motion.div>

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      src={listing.imageUrls[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-slate-800">{listing.name}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-800">
                        ₹{formatPrice(listing.discountPrice || listing.regularPrice)}
                        {listing.type === 'rent' && '/mo'}
                      </span>
                    </div>
                    
                    <h4 className="text-lg text-slate-600 mb-3">{listing.title}</h4>
                    <p className="text-slate-500 line-clamp-2 mb-6">{listing.description}</p>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <Link 
                        to={`/listing/${listing._id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        View Details →
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Link to={`/update-listing/${listing._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: "#f1f5f9" }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                            title="Edit"
                          >
                            <FiEdit className="w-5 h-5" />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "#f1f5f9" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(listing._id)}
                          className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-800 z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200">
                <div className="text-center p-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      transition: { duration: 1.5, repeat: Infinity }
                    }}
                    className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <FiTrash2 className="text-slate-700 text-3xl" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Delete Property?</h3>
                  <p className="text-slate-600 mb-8">
                    This will permanently delete this listing. Are you sure you want to continue?
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelDelete}
                      className="px-6 py-3 bg-slate-100 text-slate-800 rounded-full font-medium transition-all border border-slate-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={confirmDelete}
                      className="px-6 py-3 bg-slate-800 text-white rounded-full font-medium transition-all"
                    >
                      Delete Forever
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowListing;