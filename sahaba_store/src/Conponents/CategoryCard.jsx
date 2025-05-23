import React from 'react'
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({eachCategory}) => {

const navigate = useNavigate();


  return (
    <div onClick={()=>navigate(`/allproduct/${eachCategory?._id}`)} className='  rounded-xl bg-white border flex items-center justify-center gap-4 px-2 py-2 pr-7 cursor-pointer shadow-sm'>

        <img className='w-14 h-12 rounded-md' src={eachCategory?.image} alt="" />
        <h1 className='font-semibold text-lg'>{eachCategory?.name}</h1>
      
    </div>
  )
}

export default CategoryCard
