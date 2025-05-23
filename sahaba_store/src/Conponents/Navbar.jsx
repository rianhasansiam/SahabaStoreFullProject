import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useFetchData } from '../hooks/useFetchData'
import logo from '../assets/img/logo11.png' 

import LoadingPage from './LoadingPage'
import { contextData } from '../Contex'


const Navbar = () => {
  const { userData, signoutHandle, logoutLoading, setUserProfile,setSearchTerm,searchTerm } = useContext(contextData);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();


  // Toggle search input visibility
  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm && searchTerm.trim() !== '') {
      // Could navigate to search results page or filter current page
      if (!location.pathname.startsWith('/allproduct/')) {
        navigate('/allproduct/all');
      }
    }
  };

  // Handle clicks outside search area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchInput(false);
      }
    };

    if (showSearchInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchInput]);
  

  // Fetch categories
  const { data: categories, isLoading: catLoading } = useFetchData('categories', '/allcategories');

  // Fetch user profile when userData is present
  const { data: userProfile } = useFetchData(
    userData ? ['userProfile', userData.email] : null,
    userData ? `/user?email=${encodeURIComponent(userData.email)}` : '',
    { enabled: !!userData }
  );



  useEffect(() => {
    if (userProfile && setUserProfile) {
      setUserProfile(userProfile.data);
    }
  }, [userProfile, setUserProfile]);


  // Get cart items count for badge
  const [cartItemsCount, setCartItemsCount] = useState(0);
  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem("addtocart")) || {};
        setCartItemsCount(Object.keys(cartData).length);
      } catch (error) {
        console.error("Error reading cart data:", error);
        setCartItemsCount(0);
      }
    };

    // Initial count
    updateCartCount();

    // Listen for localStorage changes
    window.addEventListener('storage', updateCartCount);
    
    // Listen for custom event for same-tab updates
    document.addEventListener('cartUpdated', updateCartCount);

    // Set interval to check for changes (backup for same-tab updates)
    const interval = setInterval(updateCartCount, 2000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      document.removeEventListener('cartUpdated', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Get wishlist items count
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);

  // Update wishlist count when localStorage changes
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || {};
        const count = Array.isArray(wishlistData) 
          ? wishlistData.length 
          : Object.keys(wishlistData).length;
        setWishlistItemsCount(count);
      } catch (error) {
        console.error("Error reading wishlist data:", error);
        setWishlistItemsCount(0);
      }
    };

    // Initial count
    updateWishlistCount();

    // Listen for localStorage changes
    window.addEventListener('storage', updateWishlistCount);

    // Set interval to check for changes (backup for same-tab updates)
    const interval = setInterval(updateWishlistCount, 2000);

    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      clearInterval(interval);
    };
  }, []);


  return (
    <div className='bg-white sticky top-0 z-50 shadow-lg'>

      {/* Navbar here */}
      <div className="navbar container m-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow bg-white">
              <li><NavLink to="/">Home</NavLink></li>
              <li>
                 <details>
                <summary>All Products</summary>
                <ul className="p-2 bg-gray-100 rounded-md z-10">
                  {catLoading ? (
                   <LoadingPage></LoadingPage>
                  ) : (
                    <>
                      <li className='text-black'>
                        <NavLink to="/allproduct/all">All</NavLink>
                      </li>
                      {categories?.map((cat) => (
                        <li className='text-black' key={cat._id}>
                          <NavLink to={`/allproduct/${cat._id}`}>{cat.name}</NavLink>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </details>
              </li>
              <li>
                <NavLink
                  to="/wishlist"
                 
                >
                  Wishlist
                </NavLink>
              </li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              {userProfile?.data?.userRole === "Admin" && (
              <li><NavLink to="/adminpage/dashboard">Admin Pannel</NavLink></li>
              )}

               {userData ?
           <li> <NavLink onClick={signoutHandle} className=' visible lg:hidden hover:bg-gray-300'>
              {logoutLoading ? "Logouting.." : "Logout"}
            </NavLink></li> :
           <li>
            <NavLink to="/login" className=' hover:bg-gray-300 lg:hidden visible'>Login</NavLink>
           </li>  }

            </ul>
          </div>
        

          <Link to='/' className="w-44  ml-10 lg:ml-0 "><img  src={logo} alt="logo" className="h-auto w-auto object-cover" /></Link>
          
        </div>

        <div className="navbar-center hidden lg:flex text-black font-semibold">
          <ul className="menu menu-horizontal px-1">
            <li><NavLink to="/">Home</NavLink></li>
            <li>
              <details>
                <summary>All Products</summary>
                <ul className="p-2 bg-gray-100 rounded-md z-10">
                  {catLoading ? (
           <LoadingPage></LoadingPage>
                  ) : (
                    <>
                      <li className='text-black'>
                        <NavLink to="/allproduct/all">All</NavLink>
                      </li>
                      {categories?.map((cat) => (
                        <li className='text-black' key={cat._id}>
                          <NavLink to={`/allproduct/${cat._id}`}>{cat.name}</NavLink>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </details>
            </li>
            <li>
              <NavLink
                to="/wishlist"  >
                Wishlist
              </NavLink>
            </li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            {userProfile?.data?.userRole === "Admin" && (
              <li><NavLink to="/adminpage/dashboard">Admin Pannel</NavLink></li>
            )}

            

          </ul>
        </div>

        <div className="navbar-end text-black flex gap-5 text-xl items-center">
          {/* Search Icon */}
          <div className="relative" ref={searchContainerRef}>
            <button
              className='block text-black'
              onClick={toggleSearchInput}
            >
              <i className="fa-solid fa-search text-[#1e463e]  "></i>
              {/* border-2 rounded-full p-2 */}
            </button>
            
            {/* Search Input with transition */}
            <div className={`absolute right-10 border-b-2 -top-2 mt-2 transition-all duration-300 ease-in-out ${showSearchInput ? 'w-52 opacity-100' : 'w-0 opacity-0'}`}>
              <form onSubmit={handleSearchSubmit} className="flex overflow-hidden rounded-lg">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 text-black text-sm border-none focus:outline-none"
                  value={searchTerm || ''}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoFocus={showSearchInput}
                />
                {/* <button 
                  type="submit"
                  className="bg-[#22874b] text-black px-4 py-2"
                >
                  <i className="fa-solid fa-arrow-right text-sm"></i>
                </button> */}
              </form>
            </div>
          </div>
          
          <button
            className='block relative'
            onClick={() => navigate("/wishlist")}
          >
            <i className="fa-solid fa-heart text-[#1e463e]"></i>
            {wishlistItemsCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-[#22874b] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
              </span>
            )}
          </button>          <button
            className='block relative'
            onClick={() => navigate("/add-to-cart")}
          >
            <i className="fa-solid fa-cart-shopping mr-5 lg:mr-5 text-[#1e463e]"></i>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-[#22874b] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </span>
            )}
          </button>



          {userData ? 
            <NavLink onClick={signoutHandle} className='text-lg btn hidden lg:flex hover:bg-gray-300'>
              {logoutLoading ? "Logouting.." : "Logout"}
            </NavLink> :
            <NavLink to="/login" className='text-lg btn  hover:bg-gray-300 hidden lg:flex'>Login</NavLink>}


        </div>
      </div>

    </div>
  )
}

export default Navbar
