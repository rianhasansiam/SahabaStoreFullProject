import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const Adminpage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#22874b] text-white w-64 h-full fixed top-0 left-0 z-50 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative transition-transform duration-300 ease-in-out shadow-lg`}
      >
        {/* Logo and Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <h1 className="text-xl font-bold">
            <Link to="/" className="flex items-center">
              <span className="text-white bg-black px-2 py-1 rounded mr-1">Admin</span>
              <span className="text-white">Panel</span>
            </Link>
          </h1>
          <button
            onClick={toggleMenu}
            className="text-white md:hidden focus:outline-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="mt-10">
          <ul className="space-y-2 px-4">
            <li>
              <NavLink
                to="/adminpage/dashboard"
                end
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#22874b] font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminpage/allusers"
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#22874b] font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                All Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminpage/allcategories"
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#22874b] font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                All Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminpage/allproducts"
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#22874b] font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminpage/allorders"
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#22874b] font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                All Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adminpage/cuponcodes"
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-[#22874b] font-bold'
                      : 'hover:bg-white/10 text-white'
                  }`
                }
              >
                Coupon Management
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-white/20">
          <p className="text-white/70 text-sm">@rianhasansiam</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="flex justify-between items-center md:hidden p-4 bg-white shadow-sm sticky top-0 z-30">
          <h1 className="text-xl font-bold text-[#1A1A2E]">
            {location.pathname.includes('dashboard') && 'Dashboard'}
            {location.pathname.includes('allusers') && 'User Management'}
            {location.pathname.includes('allcategories') && 'Categories'}
            {location.pathname.includes('allorders') && 'Order Management'}
            {location.pathname.includes('cuponcodes') && 'Coupon Management'}
          </h1>
          <button
            onClick={toggleMenu}
            className="text-2xl text-[#22874b] focus:outline-none"
            aria-label="Open menu"
          >
            ☰
          </button>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 min-h-[calc(100vh-64px)]">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Adminpage;
