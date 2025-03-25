import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../Components/ListingItem';

const Search = () => {
    const [sidebardata, setSiderbardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: 'desc',
    });

    const navigate = useNavigate()
    const [loading,setLoading]=useState(false)
    const [listing,setListing]=useState([]);
    console.log(listing)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSiderbardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            try {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                
                if (!res.ok) {
                    throw new Error('Failed to fetch listings');
                }

                const data = await res.json();
                setListing(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };
      fetchListings()

    },[location.search])

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSiderbardata({ ...sidebardata, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setSiderbardata({ ...sidebardata, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSiderbardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split("_")[0] || 'createdAt';
            const order = e.target.value.split("_")[1] || 'desc';
            setSiderbardata({ ...sidebardata, sort, order })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    return (
        <div className='flex flex-col md:flex-row'>
            {/* leftside */}
            <div className='p-7 md:border-r-2 border-slate-200 md:h-screen md:sticky md:top-0 md:overflow-y-auto'>
                <form onSubmit={handleSubmit} action="" className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2 '>
                        <label className=' whitespace-nowrap font-semibold text-slate-700'>Search Term:</label>
                        <input type="text" id='searchTerm' placeholder='Search...'
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                            className='bg-white border border-white rounded-lg p-3 w-full' />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold text-slate-700'>Type:</label>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={sidebardata.type === 'all'}
                                type="checkbox" id="all" className='w-5' />
                            <span>Rent & Sale</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}
                                type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={sidebardata.type === 'sale'}
                                type="checkbox" id="sale" className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={sidebardata.offer}
                                type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold text-slate-700'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={sidebardata.parking}
                                type="checkbox" id="parking" className='w-5' />
                            <span>Parking</span>
                        </div>

                        <div className='flex gap-2'>
                            <input
                                onChange={handleChange}
                                checked={sidebardata.furnished}
                                type="checkbox" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>

                    </div>
                    <div className='gap-2 flex items-center'>
                        <label className='font-semibold text-slate-700'>Sort:</label>
                        <select onChange={handleChange}
                            defaultValue={'createdAt_desc'} id="sort_order" className='bg-white border p-3 rounded-lg'>
                            <option value="regularPrice_desc">Price hight to low</option>
                            <option value="regularPrice_asc">Price low to hight </option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>

            {/* rightside */}
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold  p-3 text-slate-700 mt-5'>Listing Results:</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {
                        !loading && listing.length===0 &&(
                            <p className='text-xl text-slate-700 text-center '>No listing fould!</p>
                        )
                    }
                    {
                        loading&&(
                            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                        )
                    }
                    {
                        !loading && listing && listing.map((listing)=>(
                            <ListingItem key={listing._id} listing={listing} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Search