import React, { useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'

const CreateListing = () => {
  const { currentUser } = useSelector(state => state.user)

  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate()

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

  })
  console.log(formData)



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
    setSelectedFiles([]); // Clear the file selection when the popup closes
    setFileName("No file chosen");
  };

  const handleImageSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select images to upload.");
      return;
    }
    setErrorMessage(""); // Clear the error message if images are selected
    setUploading(true);
    setUploadProgress({});
    setUploadedUrls([]);

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
    console.log(validUrls);

    setUploadedUrls(validUrls);
    setUploading(false);
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: validUrls, // Add uploaded URLs to formData
    }));
  };
  const handleDelete = (index) => {
    setUploadedUrls((prevUrls) => {
      const updatedUrls = prevUrls.filter((_, i) => i !== index);
      console.log("Remaining URLs:", updatedUrls); // Log remaining images
      return updatedUrls;
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer')
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })

    if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // If no image is selected, show error and update submitted state
    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      setSubmitted(true); // This ensures the UI updates
      return;
    }

    if(+formData.regularPrice<+formData.discountPrice){
      setError("Discount price must be lower than regular price");
      setSubmitted(true); // This ensures the UI updates
      return;
    }
  
    try {
      setLoading(true);
      setError(false);
      setSubmitted(false);
  
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          useRef: currentUser._id,
        }),
      });
      console.log("res:",res)
      const data = await res.json();
      console.log("data:",data)
      setLoading(false);
      setSubmitted(true);
  
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSubmitted(true);
    }
  };
  

  return (
    <div className="relative">
      {/* Page Content (Dims When Popup Appears) */}
      <div
        className={`p-2 max-w-6xl mx-auto transition-opacity duration-300 ${showPopup ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
      >
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              id="name"
              maxLength="62"
              minLength={5}
              placeholder="Name"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.name}
              required
            />
            <textarea id="description" placeholder="Description" rows='7' cols='15' className="border p-3 rounded-lg" required
              onChange={handleChange}
              value={formData.description} />
            <input type="text" id="address" placeholder="Address" className="border p-3 rounded-lg" required
              onChange={handleChange}
              value={formData.address}
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5" onChange={handleChange}
                  checked={formData.type === 'sale'} />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5"
                  onChange={handleChange}
                  checked={formData.type === 'rent'} />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5"
                  onChange={handleChange}
                  checked={formData.parking} />
                <span>Parking spot</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished} />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5"
                  onChange={handleChange}
                  checked={formData.offer} />
                <span>Offer</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-2'><input type="number" id="bedrooms" min='1' max='10' className='border p-3 rounded-lg' required
                onChange={handleChange}
                value={formData.bedrooms} />
                <span>Beds</span></div>
              <div className='flex items-center gap-2'><input type="number" id='bathrooms' min='1' max='10' className='border p-3 rounded-lg' required
                onChange={handleChange}
                value={formData.bathrooms} /><span>Baths</span></div>
              <div className='flex items-center gap-2'><input type="number" id='regularPrice' className='border p-3 rounded-lg' required
                min='0'
                max='100000000'
                onChange={handleChange}
                value={formData.regularPrice}
              /><span>Regular Price ($/month)</span></div>

              {formData.offer &&(
                 <div className='flex items-center gap-2'><input type="number" id='discountPrice' className='border p-3 rounded-lg' required
                 onChange={handleChange}
                 value={formData.discountPrice}
               /><span>Discount Price ($/month)</span></div>
              )}
              



            </div>


          </div>

          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-700 ml-2">The first image will be the cover (max 6)</span>
            </p>

            {/* File input & Upload button */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 relative flex items-center border border-gray-300 rounded p-2 w-full">
                  <input type="file" id="images" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                  <label htmlFor="images" className="bg-gray-200 px-3 py-1 border border-gray-500 rounded cursor-pointer">
                    Choose Files
                  </label>
                  <span className="ml-2 text-gray-700">{fileName}</span>
                </div>

                {/* Upload Button */}
                <button type="button"
                  onClick={handleImageSubmit}
                  className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>



            {/* Display uploaded images */}
            <div className="flex flex-col gap-2 ">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="border-2 border-gray-300 p-1  w-full flex justify-between items-center">
                  <img src={url} alt={`Uploaded ${index}`} className="w-40 h-20 object-contain" />
                  <button
                    onClick={() => handleDelete(index)}
                    className=" text-red-700 uppercase px-3 py-1 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>


            <div>{errorMessage && <p className="font-semibold text-red-600 text-sm">{errorMessage}</p>}
            </div>

            <div>

            <button disabled={loading||uploading}
  onClick={handleSubmit} 
  className="p-3 bg-slate-700 text-white w-full rounded-lg hover:opacity-95 disabled:opacity-80"
>
  {loading ? 'Creating...' : 'Create Listing'}
</button>

{/* Ensure error message always appears if there's an error */}
{error && <p className="text-red-700 text-sm font-semibold">{error}</p>}


            </div>
          </div>
        </form>
      </div>

      {/* Popup Box */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">You can upload a maximum of 6 images.</p>
            <button
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
              onClick={handleClosePopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
