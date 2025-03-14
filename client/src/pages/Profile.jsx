import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { updateUserSuccess } from '../Redux/user/userSlice.js';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user) || {};
  const [imageUrl, setImageUrl] = useState(currentUser?.avatar || "default-avatar-url");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [newUsername, setNewUsername] = useState(currentUser?.username || "");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
            const percentCompleted = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(1);
            setUploadProgress(percentCompleted);
          },
        }
      );

      setImageUrl(res.data.secure_url);
      dispatch(updateUserSuccess({ avatar: res.data.secure_url })); // ✅ Update Redux state
    } catch (error) {
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
  
    const newEmail = document.getElementById("email").value;
    const userData = {
      username: newUsername,
      email: newEmail,
      password: document.getElementById("password").value,
      avatar: imageUrl,
    };
  
    if (newEmail !== currentUser.email) {
      setMessageType("error");
      setMessage("You cannot change your email to another account.");
      return;
    }
  
    const response = await updateProfile(userData);
  
    if (response.success !== false) {
      dispatch(updateUserSuccess(userData)); // ✅ Update Redux state globally
      setMessageType("success");
      setMessage("Profile updated successfully! ✅");
    } else {
      setMessageType("error");
      setMessage(response.message || "Profile update failed.");
    }
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      {message && (
        <p className={`text-center font-semibold p-2 rounded-lg ${messageType === "success" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
          {message}
        </p>
      )}
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" hidden ref={fileRef} accept='image/*' onChange={handleFileUpload} />
        <div className='flex flex-col items-center'>
          <img 
            onClick={() => fileRef.current.click()} 
            src={imageUrl} 
            alt="profile" 
            className='rounded-full mt-2 h-24 w-24 object-cover cursor-pointer' 
          />
          {isUploading && (
            <span className="text-gray-700 text-sm font-semibold mt-2">
              Uploading... {uploadProgress}%
            </span>
          )}
        </div>
        <input 
          id='username' 
          type='text' 
          placeholder='Username' 
          className='border bg-white p-3 rounded-lg'
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input id='email' type='text' placeholder='Email' className='border bg-white p-3 rounded-lg' />
        <div className="relative w-full">
          <input 
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border bg-white p-3 rounded-lg w-full pr-10"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ?<FaEye />: <FaEyeSlash />}
          </button>
        </div>
        <button className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
