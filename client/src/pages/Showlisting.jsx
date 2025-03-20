import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ShowListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);

  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id || JSON.parse(JSON.parse(localStorage.getItem('persist:root'))?.user || '{}')?.currentUser?._id;

  const handleDeleteClick = (listingId) => {
    setListingToDelete(listingId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingToDelete}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        console.error('Failed to delete listing:', data.message);
        alert(data.message || 'Failed to delete listing');
        return;
      }

      // Remove deleted listing from the state
      setListings((prevListings) => prevListings.filter((listing) => listing._id !== listingToDelete));
     
      
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again later.');
    } finally {
      setShowModal(false);
      setListingToDelete(null);
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
          throw new Error(data.message || 'You can only view your own listings!');
        }

        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Dimmed Background when Modal is Active */}
      {showModal && <div className="fixed inset-0 bg-black opacity-50 z-40"></div>}

      {/* Page Content */}
      <div className={`p-10 transition ${showModal ? 'opacity-100' : 'opacity-100'}`}>
        <h1 className="text-3xl font-bold text-center mb-10">Your Listings</h1>

        {listings.length === 0 ? (
          <p className="text-center text-gray-600">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0] || 'https://via.placeholder.com/300'}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </Link>

                <h2 className="text-xl text-red-600 font-semibold mt-4">{listing.name}</h2>
                <h2 className="text-xl font-semibold mt-2">{listing.title}</h2>
                <p className="text-gray-600">{listing.description}</p>

                <div className="flex justify-between mt-10">
                  <p className="text-green-600 font-bold mt-2">₹{listing.type}</p>
                  <div className="flex gap-3">
                    <button className="bg-green-100 p-2 rounded-xl w-20 text-green-600 font-semibold">Edit</button>
                    <button
                      onClick={() => handleDeleteClick(listing._id)}
                      className="bg-red-100 p-2 rounded-xl w-20 text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this listing?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowListing;
