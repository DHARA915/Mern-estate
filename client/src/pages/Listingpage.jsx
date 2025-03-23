import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'


const Listingpage = () => {

    SwiperCore.use([Navigation])

    const [listing, setListing] = useState(null)
    const [loading, Setloading] = useState(false)
    const [error, SetError] = useState(false)
    const params = useParams()
    useEffect(() => {
        const fetchListing = async () => {
            try {
                Setloading(true)

                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if (data.success === false) {
                    SetError(true)
                    Setloading(false)
                    return;
                }
                setListing(data)
                Setloading(false)
                SetError(false)
            } catch (error) {
                SetError(true);
                Setloading(false)
            }

        }
        fetchListing()
    }, [params.listingId])


    return (
        <main>
            {
                loading && <p className='text-center my-7 text-2xl'>
                    Loading...
                </p>
            }{
                error && <Link to={'/'}>
                    <p className='text-center my-7 text-2xl text-red-500'>Something went wrong!</p>
                </Link>
            }

{
  listing && !loading && !error && (
    <>
      <Swiper navigation className="w-full">
        {listing.imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="w-full h-[550px] bg-center bg-cover"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}


        </main>
    )
}

export default Listingpage