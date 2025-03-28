import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md';
import { list } from 'postcss';


const ListingItem = ({ listing }) => {
    return (
        <div className='bg-white shadow-md hover:shadow-lg overflow-hidden transition-shadow rounded-lg w-full sm:w-[330px]'>
            <Link to={`/listing/${listing._id}`}>

            <img 
  src={listing.imageUrls[0] || 'https://mlsvani.com/wp-content/uploads/2022/03/Real-Estate.jpg'} 
  alt="listing cover"
  className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' 
/>

                <div className='p-3 flex flex-col gap-2w-full'>
                    <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
                    <div className='flex items-center gap-1 '>
                        <MdLocationOn className='h-4 w-4 text-green-700' />
                        <p className='text-gray-600 text-sm truncate'>{listing.address}</p>
    
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
                    <p className='flex items-center text-slate-500 mt-2 font-semibold'> $ 
                        {
                            listing.offer ? listing.discountPrice.toLocaleString('en-US'):listing.regularPrice.toLocaleString('en-US')

                        }{
                            listing.type==='rent' && '/month'
                        }
                    </p>
                    <div className='text-slate-700 gap-4 flex mt-3'>
                        <div className='font-bold text-xs'>
                            {listing.bedrooms>1 ? `${listing.bedrooms} beds`:
                            `${listing.bedrooms} bed`}
                        </div>
                        <div className='font-bold text-xs'>
                            {listing.bathrooms>1 ? `${listing.bathrooms} baths`:
                            `${listing.bathrooms} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ListingItem