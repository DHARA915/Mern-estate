import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaTrash, FaSignOutAlt, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUserSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutUserStart, signoutUserFailure, signoutUserSuccess } from '../Redux/user/userSlice.js';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentUser } = useSelector((state) => state.user) || {};

  const [imageUrl, setImageUrl] = useState(currentUser?.avatar || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [newUsername, setNewUsername] = useState(currentUser?.username || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
  };

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
  };

  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    },
    tap: { scale: 0.98 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const handleFileUpload = async (event) => {
    setMessage("");
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setMessageType("error");
      setMessage("Please select an image file (JPEG, PNG)");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setMessageType("error");
      setMessage("Image must be less than 2MB");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (res.data.secure_url) {
        setImageUrl(res.data.secure_url);
        setMessageType("success");
        setMessage("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessageType("error");
      setMessage("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      return await res.json();
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isUploading) {
      setMessageType("error");
      setMessage("Please wait until the image is fully uploaded.");
      return;
    }
  
    if (!newUsername.trim()) {
      setMessageType("error");
      setMessage("Username cannot be empty.");
      return;
    }
  
    const newEmail = document.getElementById("email").value;
    if (newEmail !== currentUser.email) {
      setMessageType("error");
      setMessage("You cannot change your email to another account.");
      return;
    }
  
    const userData = {
      username: newUsername,
      email: newEmail,
      password: password,
      avatar: imageUrl,
    };
  
    const response = await updateProfile(userData);
  
    if (response.success !== false) {
      dispatch(updateUserSuccess(response.user));
      setMessageType("success");
      setMessage("Profile updated successfully! ✅");
    } else {
      setMessageType("error");
      setMessage(response.message || "Profile update failed.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {  
        dispatch(deleteUserSuccess());  
        navigate("/sign-up");  
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message || "Failed to delete account"));
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
      localStorage.clear(); 
    } catch (error) {
      dispatch(signoutUserFailure(data.message));
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(241,245 , 241)] flex items-center justify-center p-4 ">
      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="fixed inset-0   flex items-center justify-center p-4 z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          >
            <motion.div 
              className="bg-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6"
              variants={modalVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-200">Confirm Account Deletion</h3>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className='text-white' />
                </button>
              </div>
              
              <p className="text-gray-200 mb-6">
                Are you sure you want to delete your account? This action cannot be undone. All your data and listings will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-4">
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-200 hover:bg-slate-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="w-full max-w-md "
        initial="hidden"
        animate="visible"
        
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white  rounded-xl shadow-2xl overflow-hidden "
          variants={cardVariants}
        >
          <motion.div 
            className="  bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white "
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-2xl font-bold text-center">Profile Settings</h1>
          </motion.div>

          <motion.div 
            className="p-4"
            variants={containerVariants}
          >
            <AnimatePresence>
              {message && (
                <motion.div 
                  className={`mb-6 p-4 rounded-lg text-center ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring" }}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <motion.div className="flex flex-col items-center" variants={itemVariants}>
                <input 
                  type="file" 
                  hidden 
                  ref={fileRef} 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group cursor-pointer"
                >
                  <motion.img 
                    onClick={() => fileRef.current.click()} 
                    src={imageUrl} 
                    className="rounded-full h-24 w-24 object-cover border-4 border-gray-200 group-hover:border-gray-300 transition-all shadow-md"
                    alt="Profile"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  />
                  <motion.div 
                    onClick={() => fileRef.current.click()}
                    className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaEdit className="text-white text-xl" />
                  </motion.div>
                </motion.div>
                {isUploading && (
                  <motion.div 
                    className="w-full mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                      <motion.div 
                        className="bg-gradient-to-r from-gray-600 to-gray-800 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                    <motion.p 
                      className="text-xs text-gray-500 mt-1 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Uploading: {uploadProgress}%
                    </motion.p>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.label 
                  className="block text-gray-700 text-sm font-medium mb-2 pl-1"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Username
                </motion.label>
                <motion.input 
                  id="username" 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition-all"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  whileFocus={{ 
                    scale: 1.01,
                    boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.5)"
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.label 
                  className="block text-gray-700 text-sm font-medium mb-2 pl-1"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Email
                </motion.label>
                <motion.input 
                  id="email" 
                  type="text" 
                  placeholder='Enter your email for verification'
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm transition-all"
                  whileFocus={{ 
                    scale: 1.01,
                    boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.5)"
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <motion.label 
                  className="block text-gray-700 text-sm font-medium mb-2 pl-1"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Password
                </motion.label>
                <motion.div
                  whileFocus={{ 
                    scale: 1.01,
                    boxShadow: "0 0 0 2px rgba(156, 163, 175, 0.5)"
                  }}
                  className="relative"
                >
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 pr-12 shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to confirm changes"
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-70 transition-all shadow-lg"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isUploading ? (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Updating...
                    </motion.span>
                  ) : (
                    "Update Profile"
                  )}
                </motion.button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link to="/create-listing">
                  <motion.button
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaPlus /> Create Listing
                  </motion.button>
                </Link>
              </motion.div>
            </form>

            <motion.div 
              className="mt-8 pt-6 border-t border-gray-200 flex justify-between"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <FaTrash className="mr-2" />
                </motion.span>
                Delete Account
              </motion.button>
              <motion.button
                onClick={handleSignOut}
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  whileHover={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <FaSignOutAlt className="mr-2" />
                </motion.span>
                Sign Out
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <Link to="/Show-Listing">
                <motion.button 
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-200 transition-all shadow-sm"
                  whileHover={{ 
                    y: -2,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Show My Listings
                </motion.button>
              </Link>
              {showListingError && (
                <motion.p 
                  className="text-red-600 text-sm mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Error showing listings
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;