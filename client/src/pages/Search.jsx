import React from 'react'

const Search = () => {
    return (
        <div className='flex flex-col md:flex-row'>
            {/* leftside */}
            <div className='p-7 md:border-r-2 md:min-h-screen'>
                <form action="" className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2 '>
                        <label className=' whitespace-nowrap font-semibold text-slate-700'>Search Term:</label>
                        <input type="text" id='searchTerm' placeholder='Search...'
                            className='bg-white border border-white rounded-lg p-3 w-full' />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold text-slate-700'>Type:</label>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="all" className='w-5' />
                            <span>Rent & Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="sale" className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold text-slate-700'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input type="checkbox" id="parking" className='w-5' />
                            <span>Parking</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type="checkbox" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>

                    </div>
                    <div className='gap-2 flex items-center'>
                        <label className='font-semibold text-slate-700'>Sort:</label>
                        <select id="sort_order" className='bg-white border p-3 rounded-lg'>
                            <option value="">Price hight to low</option>
                            <option value="">Price low to hight </option>
                            <option value="">Latest</option>
                            <option value="">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>

            {/* rightvside */}
            <div>
                <h1 className='text-3xl font-semibold  p-3 text-slate-700 mt-5'>Listing Result</h1>
            </div>
        </div>
    )
}

export default Search