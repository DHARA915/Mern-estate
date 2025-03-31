import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const UpdateListing = () => {
  const { currentUser } = useSelector(state => state.user);
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false
  });

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
      setUploadedUrls(data.imageUrls);
    };
    fetchListing();
  }, [params.listingId]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 6) {
      setShowPopup(true);
      return;
    }
    setSelectedFiles(files);
    setFileName(files.length === 1 ? files[0].name : `${files.length} files selected`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFiles([]);
    setFileName("No file chosen");
  };

  const handleImageSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select images to upload.");
      return;
    }
    setErrorMessage("");
    setUploading(true);
    setUploadProgress({});
  
    const uploadPromises = selectedFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET);
  
      return axios
        .post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(1);
              setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [file.name]: percentCompleted,
              }));
            },
          }
        )
        .then((res) => res.data.secure_url)
        .catch((error) => {
          console.error(`Upload failed for ${file.name}:`, error);
          return null;
        });
    });
  
    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url) => url !== null);
  
    setUploadedUrls((prevUrls) => [...prevUrls, ...validUrls]);
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: [...prevData.imageUrls, ...validUrls],
    }));
  
    setUploading(false);
  };

  const handleDelete = (index) => {
    setUploadedUrls((prevUrls) => {
      const updatedUrls = prevUrls.filter((_, i) => i !== index);
      setFormData((prevData) => ({
        ...prevData,
        imageUrls: updatedUrls,
      }));
      return updatedUrls;
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      });
    }

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      setSubmitted(true);
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than regular price");
      setSubmitted(true);
      return;
    }
  
    try {
      setLoading(true);
      setError(false);
      setSubmitted(false);
  
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          useRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      setSubmitted(true);
  
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(241, 245, 241)' }}>
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-2xl text-center border border-gray-200 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <p className="text-lg font-semibold mb-4 text-gray-800">You can upload a maximum of 6 images.</p>
              <motion.button
                className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                onClick={handleClosePopup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`max-w-6xl mx-auto p-6 ${showPopup ? "blur-sm" : ""}`}>
        <motion.h1 
          className="text-3xl font-bold text-center my-6 text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Edit Listing
        </motion.h1>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="flex flex-col lg:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Left Column */}
          <div className="flex flex-col gap-6 flex-1">
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Property Details</h2>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <input
                    type="text"
                    id="name"
                    maxLength="62"
                    minLength={5}
                    placeholder="Property Name"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <textarea 
                    id="description" 
                    placeholder="Description" 
                    rows='7' 
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" 
                    required
                    onChange={handleChange}
                    value={formData.description} 
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <input 
                    type="text" 
                    id="address" 
                    placeholder="Full Address" 
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" 
                    required
                    onChange={handleChange}
                    value={formData.address}
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Property Type</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'sale', label: 'Sell', checked: formData.type === 'sale' },
                  { id: 'rent', label: 'Rent', checked: formData.type === 'rent' },
                  { id: 'parking', label: 'Parking', checked: formData.parking },
                  { id: 'furnished', label: 'Furnished', checked: formData.furnished },
                  { id: 'offer', label: 'Offer', checked: formData.offer }
                ].map((item, index) => (
                  <motion.label 
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                  >
                    <input 
                      type="checkbox" 
                      id={item.id} 
                      className="w-5 h-5 accent-slate-500" 
                      onChange={handleChange}
                      checked={item.checked} 
                    />
                    <span className="text-gray-700">{item.label}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Specifications</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'bedrooms', label: 'Bedrooms', min: 1, max: 10, value: formData.bedrooms },
                  { id: 'bathrooms', label: 'Bathrooms', min: 1, max: 10, value: formData.bathrooms },
                  { 
                    id: 'regularPrice', 
                    label: formData.type === 'rent' ? 'Price ($/month)' : 'Price ($)', 
                    min: 0, 
                    max: 100000000, 
                    value: formData.regularPrice 
                  },
                  ...(formData.offer ? [{
                    id: 'discountPrice',
                    label: formData.type === 'rent' ? 'Discount ($/month)' : 'Discount ($)',
                    min: 0,
                    max: 100000000,
                    value: formData.discountPrice
                  }] : [])
                ].map((field, index) => (
                  <motion.div 
                    key={field.id}
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                  >
                    <label className="text-gray-600 mb-1 text-sm">{field.label}</label>
                    <input 
                      type="number" 
                      id={field.id} 
                      min={field.min} 
                      max={field.max} 
                      className="bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-800 outline-none focus:outline-none" 
                      required
                      onChange={handleChange}
                      value={field.value} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col flex-1 gap-6">
            <motion.div 
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-700">Images</h2>
              <p className="text-gray-500 mb-4 text-sm">The first image will be the cover (max 6)</p>

              {/* File Upload Section */}
              <div className="flex flex-col gap-4">
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="bg-gray-50 relative flex items-center border border-gray-300 rounded-lg p-2 w-full">
                    <input 
                      type="file" 
                      id="images" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                    <motion.label 
                      htmlFor="images" 
                      className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Choose Files
                    </motion.label>
                    <span className="ml-2 text-gray-600 text-sm">{fileName}</span>
                  </div>

                  <motion.button 
                    type="button"
                    onClick={handleImageSubmit}
                    className="px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <span className="flex items-center gap-1">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading
                      </span>
                    ) : "Upload"}
                  </motion.button>
                </motion.div>

                {/* Progress Indicators */}
                {uploading && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs truncate w-24">{file.name}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-slate-500 h-2 rounded-full" 
                            style={{ width: `${uploadProgress[file.name] || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 text-xs">{uploadProgress[file.name] || 0}%</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Uploaded Images */}
                <motion.div 
                  className="grid grid-cols-2 gap-3 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <AnimatePresence>
                    {uploadedUrls.map((url, index) => (
                      <motion.div 
                        key={index} 
                        className="relative group border-2 border-gray-300 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <img 
                          src={url} 
                          alt={`Uploaded ${index}`} 
                          className="w-full h-32 object-cover"
                        />
                       <motion.button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDelete(index);
  }}
  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {errorMessage && (
                  <motion.p 
                    className="text-red-500 text-xs mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <motion.button 
                disabled={loading || uploading}
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Update Listing
                  </span>
                )}
              </motion.button>

              {error && (
                <motion.p 
                  className="text-red-500 text-sm mt-3 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default UpdateListing;