import React from 'react';
import banner from '../assets/img/banner.png';

const Banner = () => {
    return (
        <div className="relative">
            {/* Single static banner instead of Swiper */}
            <img className='container mx-auto max-md:w-[95vw] lg:h-[65vh] object-cover mt-1 rounded-xl' src={banner} alt="Sahaba Store Banner" />
            
            {/* Uncomment if you want overlay text
            <div className='text-white absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50'>
                <h1 className='text-4xl md:text-6xl font-bold mb-4'>Welcome to Sahaba Store</h1>
                <p className='text-xl md:text-2xl font-semibold w-[90%] md:w-[60%] mx-auto'>
                    Quality Products at Affordable Prices
                </p>
            </div>
            */}
            
            {/* Original Swiper implementation (commented out)
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper relative"
            >
                <SwiperSlide>
                    <img className='w-[100vw] h-[70vh] object-fill' src={banner1} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img className='w-[100vw] h-[70vh] object-fill' src={banner3} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img className='w-[100vw] h-[70vh] object-cover' src={banner1} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                    <img className='w-[100vw] h-[70vh] object-fill' src={banner2} alt="" />
                </SwiperSlide>
            </Swiper>
            */}
        </div>
    );
};

export default Banner;