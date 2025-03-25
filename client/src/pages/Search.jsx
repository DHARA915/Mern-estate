import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [showmore, setShowmore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        setSiderbardata({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true',
            furnished: furnishedFromUrl === 'true',
            offer: offerFromUrl === 'true',
            sort: sortFromUrl || 'createdAt',
            order: orderFromUrl || 'desc',
        });

        const fetchListings = async () => {
            try {
                setLoading(true);
                setShowmore(false)
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                
                if (!res.ok) {
                    throw new Error('Failed to fetch listings');
                }

                const data = await res.json();
                setShowmore(data.length > 8);
                setListing(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        if (id === 'all' || id === 'rent' || id === 'sale') {
            setSiderbardata({ ...sidebardata, type: id });
        } 
        else if (id === 'searchTerm') {
            setSiderbardata({ ...sidebardata, searchTerm: value });
        } 
        else if (id === 'parking' || id === 'furnished' || id === 'offer') {
            setSiderbardata({ ...sidebardata, [id]: checked });
        } 
        else if (id === 'sort_order') {
            const [sort, order] = value.split("_");
            setSiderbardata({ ...sidebardata, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        
        navigate(`/search?${urlParams.toString()}`);
    };

    const onShowMoreClick = async () => {
        try {
            const startIndex = listing.length;
            const urlParams = new URLSearchParams(location.search);
            urlParams.set('startIndex', startIndex);
            
            const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
            const data = await res.json();
            
            setShowmore(data.length >= 9);
            setListing([...listing, ...data]);
        } catch (error) {
            console.error('Error loading more listings:', error);
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            {/* leftside */}
            <div className='p-7 md:border-r-2 border-slate-200 md:h-screen md:sticky md:top-0 md:overflow-y-auto'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
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
                            value={`${sidebardata.sort}_${sidebardata.order}`}
                            id="sort_order" 
                            className='bg-white border p-3 rounded-lg'
                        >
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>

            {/* rightside */}
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>Listing Results:</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listing.length === 0 && (
                        <p className='text-xl text-slate-700 text-center '>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )}
                    {!loading && listing.map((item) => (
                        <ListingItem key={item._id} listing={item} />
                    ))}
                </div>
                {showmore && (
                    <div className='text-center p-4'>
                        <button 
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-2 text-lg font-medium'
                        >
                            Show More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;