import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { updateUserSuccess,deleteUserStart,deleteUserSuccess,deleteUserFailure } from '../Redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
   const nevigate = useNavigate()
  
  const { currentUser } = useSelector((state) => state.user) || {};

  const [imageUrl, setImageUrl] = useState(currentUser?.avatar || "default-avatar-url");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [newUsername, setNewUsername] = useState(currentUser?.username || "");
  const [password, setPassword] = useState("");
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
      dispatch(updateUserSuccess({ avatar: res.data.secure_url }));
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
      dispatch(updateUserSuccess(userData));
      setMessageType("success");
      setMessage("Profile updated successfully! ✅");
    } else {
      setMessageType("error");
      setMessage(response.message || "Profile update failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;
  
    try {
      dispatch(deleteUserStart());  // Dispatch the start action
  
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",  // Use the DELETE method
      });
  
      if (response.ok) {  
        dispatch(deleteUserSuccess());  
       nevigate("/sign-up");  
      } else {
        const errorData = await response.json();  // Parse the error message from the response
        throw new Error(errorData.message || "Failed to delete account");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message || "Failed to delete account"));  // Dispatch failure action with error message
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
            src={imageUrl||"https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="} 
           
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ?<FaEye />: <FaEyeSlash />}
          </button>
        </div>
        <button disabled={isUploading} className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteAccount} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
