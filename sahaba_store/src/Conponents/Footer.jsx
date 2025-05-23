import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/img/logo11.png' 
export const Footer = () => {
  return (
   <footer className="bg-white text-black border-t ">
<hr className='h-1 bg-[#22874b]' />

  <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
    
    {/* CONTACT */}
    <div>
      <h3 className="font-bold mb-2">CONTACT</h3>
      <p>Tongi,Gazipur, Dhaka, Bangladesh</p>
      <p className="mt-2">Email: sahabastore130@gmail.com</p>
      <p>Phone:  +8801334314465</p>
      <p>WhatsApp:  +8801334314465</p>
    </div>

    {/* BRANDS & SOCIAL */}
    <div className="col-span-1 md:col-span-1 text-center">
      {/* <img src="/logo.png" alt="Logo" className="w-24 mx-auto mb-2" /> */}
      <h1><img className='w-44 mx-auto' src={logo} alt="logo" /></h1>

  <div className="flex justify-center gap-4 my-2">
  <a href="https://www.facebook.com/profile.php?id=61550942862694" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-facebook text-2xl text-blue-500"></i>
  </a>
  <a href="/" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-instagram text-2xl text-pink-600"></i>
  </a>
  <a href="/" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-youtube text-2xl text-red-500"></i>
  </a>
  <a href="/" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-linkedin text-2xl text-blue-500"></i>
  </a>
  <a href="/" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-tiktok text-2xl"></i>
  </a>
</div>


      <p className="mt-2">You Can Trust On Sahaba-Store</p>
      <div className="flex justify-center gap-3 mt-3">
        
      </div>
    </div>

    {/* CUSTOMER LINKS */}
    <div>
      <h3 className="font-bold mb-2">CUSTOMER</h3>
      <ul className="space-y-1">
        <li><Link to="#">Account</Link></li>
        <li><Link to="#">Cart</Link></li>
        <li><Link to="#">Wishlist</Link></li>
        <li><Link to="#">Shipping Charge</Link></li>
        <li><Link to="#">Retail Purchase</Link></li>
        <li><Link to="#">FAQ</Link></li>
      </ul>
    </div>

    {/* INFORMATION LINKS */}
    <div>
      <h3 className="font-bold mb-2">INFORMATION</h3>
      <ul className="space-y-1">
        <li><Link to="#">About us</Link></li>
        <li><Link to="#">Contact Us</Link></li>
        <li><Link to="#">Privacy Policy</Link></li>
        <li><Link to="#">Returns & Refund</Link></li>
        <li><Link to="#">Terms & Conditions</Link></li>
        <li><Link to="#">Secured Payment</Link></li>
      </ul>
    </div>

    {/* MOBILE APPS */}
    <div>
      <h3 className="font-bold mb-2">MOBILE APPS</h3>
      <div className="space-y-2">
        <img src="https://thumbs.dreamstime.com/b/google-play-app-store-icons-google-play-app-store-icons-editable-vector-illustration-isolated-white-background-123024624.jpg" alt="Google Play" className="w-32" />
        {/* <img src="/app-store.png" alt="App Store" className="w-32" /> */}
      </div>
    </div>
  </div>

  {/* PAYMENT & COPYRIGHT */}
  <div className="border-t py-6 text-center">
    <p className="text-sm">© 2025 Sahabastore - All Rights Reserved</p>
  </div>
</footer>


  )
}
