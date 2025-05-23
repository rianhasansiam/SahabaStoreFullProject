import React, { useEffect } from 'react';

import { useFetchData } from '../hooks/useFetchData';
import HomepageCard from '../Conponents/HomepageCard';
import Banner from '../Conponents/Banner';
import details1 from '../assets/img/details1.jpg';
import details2 from '../assets/img/details2.png';  
import details3 from '../assets/img/details3.png';

const Home = () => {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts
  } = useFetchData('products', '/products', {
    staleTime: 10 * 60 * 1000,
  });

  // Uncomment if you need categories
  // const {
  //   data: categories,
  //   isLoading: categoryLoading,
  //   isError: categoryError,
  //   refetch: refetchCategories
  // } = useFetchData('categories', '/allcategories', {
  //   staleTime: 10 * 60 * 1000,
  // });

  useEffect(() => {
    refetchProducts();
    // Uncomment if you need categories
    // refetchCategories();
  }, [refetchProducts]); // Added dependency

  if (productsLoading) {
    return <div className="text-center py-20">Loading products...</div>;
  }

  if (productsError) {
    return <div className="text-center py-20 text-red-500">Error loading products</div>;
  }

  return (
    <div className='bg-[#f7f7f7]'>
 
     <Banner />
      {/* Uncomment if you need categories section */}
      {/* <h1 className='text-center font-bold text-4xl mt-10 lg:text-6xl'>All Category</h1>
      <div className='flex gap-x-10 gap-y-4 my-10 container mx-auto flex-wrap justify-center'>
        {categories?.map((eachCategory) => (
          <CategoryCard key={eachCategory._id} eachCategory={eachCategory} />
        ))}
      </div> */}


      <h1 className='text-center text-3xl font-bold lg:text-4xl my-10 lg:mt-14'>All Product</h1>

      <div className='mb-20 container mx-auto w-[98vw] lg:w-[90vw] '>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
          {products?.map((product) => (
            <HomepageCard key={product._id} product={product} />
          ))}
        </div>
      </div>




      <div className='grid grid-cols-1 lg:grid-cols-3  mt-10 container max-sm:w-[95vw] mx-auto '>
      
        <div className='flex  items-center justify-start'>
          <img className='w-28' src={details3} alt="" />
          <div>
      
          <h2 className='font-bold text-lg'>নিরাপদ পেমেন্ট</h2>
          <p className='text-sm'>বিভিন্ন পেমেন্ট পদ্ধতি থেকে বেছে নিন</p>
          </div>
        </div>
        <div className='flex justify-start items-center'>
          <img className='w-28' src={details2} alt="" />
          <div>
      
          <h2 className='font-bold text-lg'>ডেলেভারি</h2>
          <p className='text-sm'>ঢাকা সিটির ভিতরে ১-২ দিন ঢাকা সিটির বাহিরে ২-৩ দিনের ভিতরে আপনার পন্য পৌছে যাবে
      ১০০% ন্যাচারাল</p>
          </div>
        </div>
        <div className='flex justify-start items-center'>
          <img className='w-28' src={details1} alt="" />
          <div>
      
          <h2 className='font-bold text-lg'>১০০% ন্যাচারাল</h2>
          <p className='text-sm'>প্রাকৃতিক উপাদান ব্যবহার করতে আমরা প্রতিশ্রুতিবদ্ধ</p>
          </div>
        </div>
      
      
      </div>
    </div>
  );
};

export default Home;