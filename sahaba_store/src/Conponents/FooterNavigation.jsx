import React, { useEffect, useState } from 'react';
import { FiHome, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FooterNavigation = () => {  const links = [
    { name: "Home", icon: <FiHome size={20} />, path: "/" },
    { name: "Wishlist", icon: <FiHeart size={20} />, path: "/wishlist" },
    { name: "Cart", icon: <FiShoppingCart size={20} />, path: "/add-to-cart" },
 
  ];

  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShowFooter(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShowFooter(false); // scrolling down
      } else {
        setShowFooter(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 transition-transform duration-300 md:hidden ${
        showFooter ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-md mx-auto px-4">
        <nav className="flex justify-between items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="flex flex-col items-center py-3 px-4 text-center text-xs font-medium text-black hover:text-[#167389] transition-colors flex-1"
            >
              <div className="mb-1">
                {link.icon}
              </div>
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default FooterNavigation;