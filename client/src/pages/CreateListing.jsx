import React, { useState } from "react";
import axios from "axios";

const CreateListing = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


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
  };
  const handleDelete = (index) => {
    setUploadedUrls((prevUrls) => {
      const updatedUrls = prevUrls.filter((_, i) => i !== index);
      console.log("Remaining URLs:", updatedUrls); // Log remaining images
      return updatedUrls;
    });
  };
  


  return (
    <div className="relative">
      {/* Page Content (Dims When Popup Appears) */}
      <div
        className={`p-2 max-w-3xl mx-auto transition-opacity duration-300 ${showPopup ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
      >
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              id="name"
              maxLength="62"
              minLength={5}
              placeholder="Name"
              className="border p-3 rounded-lg"
              required
            />
            <textarea id="description" placeholder="Description" className="border p-3 rounded-lg" required />
            <input type="text" id="Address" placeholder="Address" className="border p-3 rounded-lg" required />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="Parking" className="w-5" />
                <span>Parking spot</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="Furnished" className="w-5" />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="Offer" className="w-5" />
                <span>Offer</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-2'><input type="number" id="bedrooms" min='1' max='10' className='border p-3 rounded-lg' required /><span>Beds</span></div>
              <div className='flex items-center gap-2'><input type="number" id='bathrooms' min='1' max='10' className='border p-3 rounded-lg' required /><span>Baths</span></div>
              <div className='flex items-center gap-2'><input type="number" id='regularprice' className='border p-3 rounded-lg' required /><span>Regular Price ($/month)</span></div>
              <div className='flex items-center gap-2'><input type="number" id='discountprice' className='border p-3 rounded-lg' required /><span>Discount Price ($/month)</span></div>
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
                  <img src={url} alt={`Uploaded ${index}`} className="w-20 h-20 object-contain" />
                  <button
                    onClick={() => handleDelete(index)}
                    className=" text-slate-600 px-3 py-1 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>


            <div>{errorMessage && <p className="font-semibold text-red-600 text-sm">{errorMessage}</p>}
            </div>

            <div>

              <button className="p-3 bg-slate-700 text-white w-full rounded-lg hover:opacity-95 disabled:opacity-80">
                CREATE LISTING
              </button>
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
