import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { contextData } from '../Contex'

const Searchbar = () => {
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useContext(contextData);
  return (
    <>
      { (location.pathname === '/' || location.pathname.startsWith('/allproduct/')) && (
        <div className="form-control w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
          <div className="input-group flex pb-5">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered w-full block rounded-l-3xl rounded-r-none 
                       focus:outline-none focus:border-none focus:ring-0"
              value={searchTerm || ''}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square bg-black text-white border-none rounded-r-3xl rounded-l-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Searchbar
