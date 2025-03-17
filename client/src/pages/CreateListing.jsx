import React from 'react'
import { useState } from 'react';

const CreateListing = () => {
  const [fileName, setFileName] = useState("No file chosen");
 

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(files)
    if (files.length > 0) {
      setFileName(files.length === 1 ? files[0].name : `${files.length} files selected`);
    } else {
      setFileName("No file chosen");
    }
  };
  return (
    <main className='p-2 max-w-3xl mx-auto'>

      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type="text" id="name" maxLength="62"
            minLength={5} placeholder='Name' className='border p-3 rounded-lg' required />

          <textarea type="text" id="description" placeholder='Description' className='border p-3 rounded-lg' required />

          <input type="text" id="Address" placeholder='address' className='border p-3 rounded-lg' required />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" id="sale" className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="sarentle" className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="Parking" className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="Furnished" className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="Offer" className='w-5' />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-4'>

            <div className='flex  items-center gap-2'>
              <input type="number" id="bedrooms" min='1' max='10' className='bg-white p-3 border border-gray-300 rounded-lg' required />
              <span>Beds</span>
            </div>

            <div className='flex  items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' className='bg-white p-3 border border-gray-300 rounded-lg' required />
              <span>Baths</span>
            </div>

            <div className='flex  items-center gap-2'>
              <input type="number" id='regularprice' className='bg-white p-3 border border-gray-300 rounded-lg' required />

              <div className='flex flex-col items-center'>
                <span>Regular Price</span>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>

            <div className='flex  items-center gap-2'>
              <input type="number" id='discountprice' className='bg-white p-3 border border-gray-300 rounded-lg' required />
              <div className='flex flex-col items-center'>
                <span>Discount Price</span>
                <span className='text-xs'>($ / month)</span>
              </div>

            </div>

          </div>

        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first images will be the cover (max 6)
            </span>
          </p>

          {/* File input & Upload button in the same row */}
          <div className='flex flex-col'>
            <div className="flex items-center gap-2">
              {/* File Input Container */}
              <div className="bg-[rgb(241,245,241)] relative flex items-center border border-gray-300 rounded p-2 w-full">
                {/* Hidden File Input */}
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Custom Label for File Input */}
                <label
                  htmlFor="images"
                  className="bg-[rgb(241,245,241)] px-3 py-1 border border-gray-500 rounded cursor-pointer"
                >
                  Choose Files
                </label>

                {/* Display selected file name */}
                <span className="ml-2 text-gray-700">{fileName}</span>
              </div>

              <div>
                {/* Upload Button (Now inline with the file input) */}
                <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                  Upload
                </button>
              </div>

            </div>
          </div>
          <div>
            <button className='p-3 bg-slate-700 text-white w-full rounded-lg hover:opacity-95 disabled:opacity-80'>CREATE LISTING</button>
          </div>
        </div>


      </form>
    </main>
  )
}

export default CreateListing