// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetchData } from '../hooks/useFetchData';
import { usePostData } from '../hooks/usePostData';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// Add custom CSS for enhanced animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes slideInScale {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }
  
  .fade-in-left {
    animation: fadeInLeft 0.8s ease-out;
  }
  
  .fade-in-right {
    animation: fadeInRight 0.8s ease-out;
  }
  
  .slide-in-scale {
    animation: slideInScale 0.6s ease-out;
  }
  
  .hover-bounce:hover {
    animation: bounce 0.6s ease-in-out;
  }
  
  .hover-pulse:hover {
    animation: pulse 0.6s ease-in-out;
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  
  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  
  .gradient-border {
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #10b981, #059669) border-box;
    border: 2px solid transparent;
  }
  
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  }
  
  .hover-glow:hover {
    box-shadow: 0 0 30px rgba(34, 135, 75, 0.3);
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  .stagger-fade {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .stagger-fade:nth-child(1) { animation-delay: 0.1s; }
  .stagger-fade:nth-child(2) { animation-delay: 0.2s; }
  .stagger-fade:nth-child(3) { animation-delay: 0.3s; }
  .stagger-fade:nth-child(4) { animation-delay: 0.4s; }
  .stagger-fade:nth-child(5) { animation-delay: 0.5s; }
  .stagger-fade:nth-child(6) { animation-delay: 0.6s; }
  .stagger-fade:nth-child(7) { animation-delay: 0.7s; }
  .stagger-fade:nth-child(8) { animation-delay: 0.8s; }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const ProductDetailsNew = () => {
    // Animation variants for framer-motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        }
    };

    // Create ref for order form section
    const orderFormRef = useRef(null);

    // Smooth scroll to order form function
    const scrollToOrderForm = () => {
        if (orderFormRef.current) {
            orderFormRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

      // Customer review images
  const reviewImages = [
    "https://i.ibb.co/GLndPnK/Whats-App-Image-2025-05-31-at-1-49-50-PM.jpg",
    "https://i.ibb.co/k2MyW6wb/Whats-App-Image-2025-05-31-at-1-49-55-PM.jpg",
    "https://i.ibb.co/JRLZ1vvM/Whats-App-Image-2025-05-31-at-1-50-00-PM.jpg",
    "https://i.ibb.co/SDggrtVT/Whats-App-Image-2025-05-31-at-1-50-05-PM.jpg",
    "https://i.ibb.co/CsM2wCp3/Whats-App-Image-2025-05-31-at-1-50-14-PM.jpg",
    "https://i.ibb.co/s97mZpff/Whats-App-Image-2025-05-31-at-1-50-20-PM.jpg",
    "https://i.ibb.co/jPCNw6ft/Whats-App-Image-2025-05-31-at-1-50-25-PM.jpg",
    "https://i.ibb.co/r2hXJHbf/Whats-App-Image-2025-05-31-at-1-50-33-PM.jpg",
    "https://i.ibb.co/gM3tz5F1/Whats-App-Image-2025-05-31-at-1-50-41-PM.jpg",
    "https://i.ibb.co/3m6cvqqq/Whats-App-Image-2025-05-31-at-1-50-51-PM.jpg",
    "https://i.ibb.co/msnb0tn/Whats-App-Image-2025-05-31-at-2-11-58-PM.jpg",
    "https://i.ibb.co/xSswLdqW/Whats-App-Image-2025-05-31-at-2-11-59-PM-1.jpg",
    "https://i.ibb.co/2YyZjGbY/Whats-App-Image-2025-05-31-at-2-11-59-PM.jpg",
   
  ];


    const { id } = useParams();
    const navigate = useNavigate();
    const { data: product, isLoading, error } = useFetchData(
        'product',
        `/products/${id}`
    );
    const postOrder = usePostData('/add-order');
    
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        coupon: '',
        paymentMethod: 'cash-on-delivery' // Add payment method like CheckoutPage
    });// Reset selectedVariant if it's out of bounds when product data changes
    useEffect(() => {
        if (product?.priceVariants && selectedVariant >= product.priceVariants.length) {
            setSelectedVariant(0);
        }
    }, [product, selectedVariant]);

    // Fetch coupons from API
    const fetchCoupons = async () => {
        try {
            const response = await fetch('https://api.sahaba-store.shop/coupons');
            const data = await response.json();
            setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        }
    };

    // Check for applied coupon in localStorage
    useEffect(() => {
        fetchCoupons();
        const couponData = localStorage.getItem('appliedCoupon');
        if (couponData) {
            const savedCoupon = JSON.parse(couponData);
            setAppliedCoupon(savedCoupon);
            setDiscount(savedCoupon.discount);
        }
    }, []);

    // Apply coupon code
    const applyCoupon = () => {
        setCouponError('');
        
        if (!formData.coupon.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const foundCoupon = coupons.find(coupon => 
            coupon.code.toLowerCase() === formData.coupon.trim().toLowerCase()
        );

        if (!foundCoupon) {
            setCouponError('Invalid coupon code');
            return;
        }

        if (foundCoupon.status !== 'active') {
            setCouponError('This coupon is not active');
            return;
        }

        // Calculate subtotal to check minimum order
        const subtotal = getPrice() * quantity;

        if (subtotal < foundCoupon.minOrder) {
            setCouponError(`Minimum order amount for this coupon is ৳${foundCoupon.minOrder}`);
            return;
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (foundCoupon.type === 'fixed') {
            discountAmount = foundCoupon.discount;
        } else if (foundCoupon.type === 'percentage') {
            discountAmount = subtotal * (foundCoupon.discount / 100);
        }
        
        setAppliedCoupon(foundCoupon);
        setDiscount(discountAmount);
        
        // Save coupon to localStorage
        localStorage.setItem('appliedCoupon', JSON.stringify({
            code: foundCoupon.code,
            discount: discountAmount,
            type: foundCoupon.type
        }));
        
        toast.success('Coupon applied successfully!');
    };

    // Remove applied coupon
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setFormData(prev => ({ ...prev, coupon: '' }));
        localStorage.removeItem('appliedCoupon');
        toast.info('Coupon removed');
    };const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Helper function to safely extract price
    const getPrice = () => {
        try {
            if (product?.priceVariants && product.priceVariants[selectedVariant] && product.priceVariants[selectedVariant].price) {
                const priceString = String(product.priceVariants[selectedVariant].price);
                const numericPrice = parseInt(priceString.replace(/\D/g, ''));
                return isNaN(numericPrice) ? 0 : numericPrice;
            }
            return 0;
        } catch (error) {
            console.error('Error parsing price:', error);
            return 0;
        }    };

    // Helper function to calculate final total
    const getFinalTotal = () => {
        const subtotal = getPrice() * quantity;
        const finalTotal = subtotal - discount;
        return finalTotal > 0 ? finalTotal : subtotal;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double submission
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            // Clear previous errors
            setErrors({});
              // Validate required fields (improved validation like CheckoutPage)
            const newErrors = {};
            
            if (!formData.name.trim()) {
                newErrors.name = 'নাম প্রয়োজন';
            }
            
            if (!formData.phone.trim()) {
                newErrors.phone = 'ফোন নম্বর প্রয়োজন';
            } else {
                // Validate phone number (Bangladeshi format) - same as CheckoutPage
                if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
                    newErrors.phone = 'সঠিক বাংলাদেশী ফোন নম্বর দিন';
                }
            }
            
            if (!formData.address.trim()) {
                newErrors.address = 'ঠিকানা প্রয়োজন';
            }
            
            // If there are errors, set them and return
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                Swal.fire({
                    icon: 'error',
                    title: 'ফর্মে ত্রুটি',
                    text: 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন',
                });
                return;
            }

            // Additional validation for empty cart (like CheckoutPage)
            if (!product || quantity <= 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'পণ্য নির্বাচন করুন',
                    text: 'অনুগ্রহ করে একটি পণ্য নির্বাচন করুন এবং পরিমাণ নিশ্চিত করুন',
                });
                return;
            }

            // Calculate prices
            const itemPrice = getPrice();
            const subtotal = itemPrice * quantity;
            const finalTotal = subtotal - discount;            // Create order object matching CheckoutPage format exactly
            const orderData = {
                customer: {
                    name: formData.name.trim(),
                    phone: formData.phone,
                },
                shipping: {
                    address: formData.address.trim(),
                },
                payment: {
                    method: formData.paymentMethod || 'cash-on-delivery',
                    status: formData.paymentMethod === 'cash-on-delivery' ? 'pending' : 'paid',
                },
                products: [{
                    productId: product._id,
                    name: product.name,
                    price: itemPrice,
                    quantity: quantity,
                    image: product.thumbnail || product.images?.[0],
                    size: product.priceVariants?.[selectedVariant]?.quantity || "250 ml",
                    totalPrice: itemPrice * quantity
                }],
                coupon: appliedCoupon ? {
                    code: appliedCoupon.code,
                    discount: discount,
                    type: appliedCoupon.type                } : null,
                subtotal: appliedCoupon ? (finalTotal > 0 ? finalTotal : subtotal) + discount : subtotal,
                orderTotal: finalTotal > 0 ? finalTotal : subtotal,
                createdAt: new Date().toISOString()
            };

            // Submit order to API
            const response = await postOrder.mutateAsync(orderData);
            
            // Clear applied coupon data on successful order
            localStorage.removeItem('appliedCoupon');
            
            Swal.fire({
                icon: 'success',
                title: 'অর্ডার সফল!',
                text: `আপনার অর্ডার #${response?.data?._id || ''} সফলভাবে স্থাপিত হয়েছে`,
                showCancelButton: true,
                confirmButtonText: 'অর্ডার বিস্তারিত দেখুন',
                cancelButtonText: 'আরো কেনাকাটা করুন'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/orderOverview', { state: { order: response?.data || orderData } });
                } else {
                    navigate('/');
                }
            });
              // Reset form
            setFormData({
                name: '',
                phone: '',
                address: '',
                coupon: '',
                paymentMethod: 'cash-on-delivery'
            });
            setQuantity(1);
            setSelectedVariant(0);
            setAppliedCoupon(null);
            setDiscount(0);
              } catch (error) {
            console.error('Order submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'অর্ডার ব্যর্থ',
                text: error.response?.data?.message || 'আপনার অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
            });
        } finally {
            setIsSubmitting(false);
        }};

    if (isLoading) return (
        <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
            <p className="mt-4 text-lg font-semibold text-gray-600 fade-in-up">Loading...</p>
        </div>
    );
    if (error) return (
        <div className="text-center py-20 text-red-500 fade-in-up">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg font-semibold">Error loading product</p>
        </div>
    );
    if (!product) return (        <div className="text-center py-20 fade-in-up">
            <div className="text-4xl mb-4">📦</div>
            <p className="text-lg font-semibold text-gray-600">Product not found</p>
        </div>
    );

    return (
        <div className="font-bangla bg-white text-gray-800">
            {/* Hero Banner */}
            <div className="relative fade-in-up">
                <div className="bg-[#2fa05c] h-[15vh] md:h-[20vh] rounded-b-3xl mt-1 mx-1 md:mx-2 transition-all duration-500 hover:shadow-lg"></div>
                <div className="bg-[#22874b] w-[90%] md:w-[70vw] mx-auto shadow-lg rounded-xl py-6 absolute top-[10vh] md:top-[15vh] left-1/2 transform -translate-x-1/2 slide-in-scale hover-glow">
                    <h1 className="text-center text-white text-xl md:text-4xl font-extrabold">
                        {product.name}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 mt-32 md:mt-40">
                {/* Order Now Button */}
                <div className="text-center my-8 fade-in-up">
                    <button 
                        onClick={scrollToOrderForm}
                        className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover-bounce"
                    >
                        <i className="fa-solid fa-cart-shopping mr-3 transition-transform duration-300"></i> অর্ডার করুন
                    </button>
                </div>                {/* YouTube Video Section */}
                <div className="my-10 fade-in-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#22874b] slide-in-scale">
                        গ্রাহকদের অভিজ্ঞতা
                    </h2>
                    <div className="relative w-full max-w-4xl mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                        <div className="relative pb-[56.25%] h-0"> {/* 16:9 aspect ratio */}
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full transition-all duration-300"
                                src="https://www.youtube.com/embed/4UBUqeRjBoQ" 
                                title="Zaituni Kalojira Oil Feedbacks from Repeated Consumers!" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    <p className="text-center mt-4 text-gray-600 text-sm md:text-base fade-in-up" style={{animationDelay: '0.3s'}}>
                        আমাদের নিয়মিত গ্রাহকদের প্রকৃত অভিজ্ঞতা এবং মতামত শুনুন
                    </p>
                </div>

                {/* Benefits Banner */}                <div className="bg-[#95cfac] w-full py-3 my-10 rounded-xl fade-in-right hover:shadow-lg transition-all duration-300">
                    <h1 className="bg-white text-lg md:text-xl font-bold px-4 ml-4 inline-block rounded-md transition-all duration-300 hover:shadow-md">
                        - চুলের যত্নে - ফেইস ও স্কিনের যত্নে - দেহের অজানা আরও অনেক সমস্যা সমাধানে
                    </h1>
                </div>

                {/* Hadith Section */}
                <div className="border-4 border-black w-full md:w-[70vw] mx-auto py-6 md:py-10 text-center font-extrabold text-xl md:text-3xl rounded-3xl my-10 shadow-lg">
                    বিশ্বনবী হযরত মুহাম্মদ ﷺ বলেছেন, "এই 'কালোজিরা' মৃত্যু ব্যতিত সকল রোগের মহাঔষধ।" 
                    <span className="text-red-500 block md:inline">-সহীহ বুখারী, ৫২৮৫</span>
                </div>                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button 
                        onClick={scrollToOrderForm}
                        className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300"
                    >
                        <i className="fa-solid fa-cart-shopping mr-3"></i> অর্ডার করুন
                    </button>
                </div>                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16 fade-in-left">
                    <div className="slide-in-scale">
                        <h2 className="text-2xl font-bold mb-6 text-[#22874b]">কালোজিরা তেলের উপকারিতা</h2>
                        <ul className="space-y-4">
                            {[
                                "চেহারার ব্রণ, একনে স্থায়ীভাবে দূর করতে সহায়তা করে",
                                "চুলে ব্যবহারে চুল পড়া বন্ধ করতে সাহায্য করে",
                                "স্কিনে মালিশে এলার্জি, চর্মরোগজনিত রোগ দূর করতে সাহায্য করে",
                                "প্রতিনিয়ত ব্যবহারে স্কিন উজ্জল করে",
                                "প্রতিনিয়ত খেলে রোগ বালাই কমে যাবে",
                                "শরীরচর্চা-জিম করায় নিত্যদিনের প্রাকৃতিক সঙ্গী",
                                "মাইগ্রেনের ব্যথা, জয়েন্টের ব্যথা দূর করে",
                                "চা-মধুর সাথে অনায়াসেই খাওয়া যায়"
                            ].map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <i className="fa-solid fa-check text-[#22874b] mt-1 mr-2"></i>
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>                    <div className="flex justify-center slide-in-scale">
                        <img 
                            src={product.images[0] || product.thumbnail} 
                            alt={product.name}
                            className="rounded-lg shadow-md max-h-96 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:rotate-1"
                        />
                    </div>
                </div>                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button 
                        onClick={scrollToOrderForm}
                        className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300"
                    >
                        <i className="fa-solid fa-cart-shopping mr-3"></i> অর্ডার করুন
                    </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                    {/* Why Choose Us */}
                    <div className="border-4 border-[#22874b] rounded-xl p-6">
                        <h2 className="bg-[#22874b] text-white text-xl font-bold py-2 px-4 rounded-sm mb-4">
                            হেব্বাতেনিয়া কালোজিরা তেল কেন নিবেন?
                        </h2>
                        <ul className="space-y-3">
                            {[
                                "আমরা কোনো প্রকার ক্যামিকাল না মিশিয়ে কালোজিরার তেল প্রস্তুত করি",
                                "আমাদের কালোজিরার তেল অথেন্টিক হওয়ায়, আপনি অগণিত উপকারগুলো পাবেন",
                                "হাইজিন মেইনটেইন করে আমরা কালোজিরার তেল বোতলজাত করে থাকি"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <i className="fa-solid fa-check text-[#22874b] mt-1 mr-2"></i>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Reviews */}
                     <div className="border-4 border-[#22874b] rounded-xl p-6">
          <h2 className="bg-[#22874b] text-white text-xl font-bold py-2 px-4 rounded-sm mb-4">
            সম্মানিত গ্রাহকদের রিভিউ
          </h2>
          
          {/* Swiper Review Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              effect="coverflow"
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              className="review-swiper"
            >
              {reviewImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full">
                    <img 
                      src={img} 
                      alt={`Customer review ${index + 1}`}
                      className="w-full h-96 md:h-[500px] lg:h-[600px] object-contain rounded-lg bg-gray-50 mx-auto"
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              {/* Custom Navigation Buttons */}
              <div className="swiper-button-prev-custom absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer z-10">
                <FaChevronLeft size={16} />
              </div>
              <div className="swiper-button-next-custom absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer z-10">
                <FaChevronRight size={16} />
              </div>
            </Swiper>
          </div>
        </div>
                </div>                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button 
                        onClick={scrollToOrderForm}
                        className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300"
                    >
                        <i className="fa-solid fa-cart-shopping mr-3"></i> অর্ডার করুন
                    </button>
                </div>                {/* Order Form Section */}
                <motion.div 
                    className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-6 sm:py-12 fade-in-up" 
                    ref={orderFormRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="container mx-auto px-4 max-w-7xl">
                        {/* Enhanced Header - Responsive */}
                        <motion.div 
                            className="text-center mb-8 sm:mb-12 slide-in-scale"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className="inline-block p-1 sm:p-2 bg-green-100 rounded-full mb-3 sm:mb-4 float-animation"
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <motion.div 
                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-all duration-300 hover:scale-110"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                                    </svg>
                                </motion.div>
                            </motion.div>
                            <motion.h1 
                                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent fade-in-up"
                                variants={itemVariants}
                            >
                                অর্ডার করতে নিচের ফর্মটি পূরণ করুন
                            </motion.h1>
                            <motion.p 
                                className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto fade-in-up"
                                variants={itemVariants}
                            >
                                "রিটার্নিং কাস্টমার হলে বিশেষ ছাড় পেতে কুপন কোড ব্যবহার করুন"
                            </motion.p>
                            <motion.div 
                                className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mt-3 sm:mt-4 rounded-full fade-in-up"
                                variants={itemVariants}
                                initial={{ width: 0 }}
                                animate={{ width: "auto" }}
                                transition={{ duration: 1, delay: 0.5 }}
                            ></motion.div>
                        </motion.div>
    
                        <form onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Product Selection & Billing */}
        <div className="lg:w-2/3 space-y-6">
          {/* Enhanced Products Section - Responsive */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                </svg>
                আপনার প্রোডাক্ট নির্বাচন করুন
              </h2>
              <p className="text-green-100 text-xs sm:text-sm mt-1">নিচের অপশন থেকে আপনার পছন্দের প্রোডাক্ট ও পরিমাণ বেছে নিন</p>
            </div>
            <div className="p-4 sm:p-6">
              {product && product.priceVariants && product.priceVariants.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {product.priceVariants.map((variant, index) => (
                    <div 
                      key={index} 
                      className={`relative border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-300 cursor-pointer hover:shadow-md ${
                        selectedVariant === index 
                          ? 'border-green-500 bg-green-50 shadow-sm sm:shadow-md' 
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedVariant(index)}
                    >
                      {selectedVariant === index && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h4c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                      
                      <input
                        type="radio"
                        id={`variant-${index}`}
                        name="productVariant"
                        value={index}
                        checked={selectedVariant === index}
                        onChange={() => setSelectedVariant(index)}
                        className="sr-only"
                      />
                      
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden shadow-sm sm:shadow-md flex-shrink-0">
                          <img
                            src={variant.image || product.thumbnail || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate">{product.name}</h3>
                          <p className="text-green-600 font-medium text-sm sm:text-base">{variant.quantity}</p>
                          <div className="flex items-center justify-between mt-1 sm:mt-2">
                            <span className="text-xl sm:text-2xl font-bold text-gray-800">{variant.price} ৳</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quantity Selector - Responsive */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">পরিমাণ নির্বাচন করুন</label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition-all duration-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                  <div className="px-3 py-1 sm:px-4 sm:py-2 bg-white border-2 border-gray-300 rounded-md sm:rounded-lg">
                    <span className="text-lg sm:text-xl font-semibold text-gray-800">{quantity}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 flex items-center justify-center transition-all duration-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>          {/* Enhanced Billing Details - Responsive */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl border border-gray-100 overflow-hidden fade-in-right hover:shadow-2xl transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 float-animation" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                গ্রাহকের তথ্য
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">আপনার সঠিক তথ্য প্রদান করুন</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="stagger-fade">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white transition-all duration-300 hover:shadow-md focus:scale-105 ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                    }`}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    required
                  />
                  <svg className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white transition-all duration-200 ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                    }`}
                    required
                  />
                  <svg className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    placeholder="বাসার নাম্বার, রোড, এলাকার নাম, উপজেলা, জেলা"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white transition-all duration-200 resize-none ${
                      errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                    }`}
                    rows={3}
                    required
                  />
                  <svg className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.address}
                  </p>
                )}              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  পেমেন্ট পদ্ধতি <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                    <input
                      type="radio"
                      id="cash-on-delivery"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={formData.paymentMethod === 'cash-on-delivery'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="cash-on-delivery" className="ml-3 flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      ক্যাশ অন ডেলিভারি
                    </label>
                  </div>
                </div>
              </div>

              {/* <div>
                <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  অর্ডার নোট (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <textarea
                    id="note"
                    name="note"
                    placeholder="অর্ডার সম্পর্কে বিশেষ কোনো নির্দেশনা"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white border-gray-300 focus:border-green-500 transition-all duration-200 resize-none"
                    rows={2}
                  />
                  <svg className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary - Responsive */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl border border-gray-100 overflow-hidden lg:sticky lg:top-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                অর্ডার সামারি
              </h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-1">আপনার অর্ডারের বিস্তারিত</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Product Summary - Responsive */}
              {product && product.priceVariants && product.priceVariants[selectedVariant] && (
                <div className="border-2 border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gray-50">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden shadow-sm sm:shadow-md flex-shrink-0">
                      <img
                        src={product.priceVariants[selectedVariant].image || product.thumbnail || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{product.name}</h3>
                      <p className="text-green-600 font-medium text-xs sm:text-sm">{product.priceVariants[selectedVariant].quantity}</p>
                      <div className="flex justify-between items-center mt-1 sm:mt-2">
                        <span className="text-xs sm:text-sm text-gray-600">পরিমাণ: {quantity}</span>
                        <span className="font-bold text-base sm:text-lg text-gray-800">{getPrice() * quantity} ৳</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown - Responsive */}
              <div className="space-y-2 sm:space-y-3 border-t pt-3 sm:pt-4">
                {/* <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>সাবটোটাল:</span>
                  <span className="font-semibold">{getPrice() * quantity} ৳</span>
                </div> */}
                
                {/* Shipping - Responsive */}
                {/* <div className="space-y-2 sm:space-y-3">
                  <p className="font-semibold text-gray-700 text-sm sm:text-base flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                    ডেলিভারি চার্জ
                  </p>
                  <div className="space-y-1 sm:space-y-2 pl-5 sm:pl-6">
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-2 rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="dhaka-inside"
                        id="dhaka-inside"
                        name="shipping"
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        defaultChecked
                      />
                      <span className="text-xs sm:text-sm text-gray-700">ঢাকা সিটির ভিতরে</span>
                      <span className="ml-auto font-semibold text-green-600 text-xs sm:text-sm">৬০ ৳</span>
                    </label>
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-2 rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="dhaka-outside"
                        id="dhaka-outside"
                        name="shipping"
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">ঢাকা সিটির বাহিরে</span>
                      <span className="ml-auto font-semibold text-orange-600 text-xs sm:text-sm">১০০ ৳</span>
                    </label>
                    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-1 sm:p-2 rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="courier"
                        id="courier"
                        name="shipping"
                        className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">কুরিয়ার সার্ভিস</span>
                      <span className="ml-auto font-semibold text-red-600 text-xs sm:text-sm">১০০ ৳</span>
                    </label>
                  </div>
                </div> */}

                {/* Discount - Responsive */}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-md sm:rounded-lg text-sm sm:text-base">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      ছাড় ({appliedCoupon.code})
                    </span>
                    <span className="font-semibold">-{discount} ৳</span>
                  </div>
                )}
              </div>

                                            {/* Total */}
                                            <div className="border-t-2 border-gray-200 pt-4">
                                                <div className="flex justify-between items-center text-xl font-bold text-gray-800 bg-green-50 p-4 rounded-xl">
                                                    <span>মোট পরিমাণ:</span>
                                                    <span className="text-green-600">{getFinalTotal()} ৳</span>
                                                </div>
                                            </div>

                                            {/* Enhanced Coupon Code */}
                                            <div className="border-t pt-6">
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                                                    <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h4c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                                                        </svg>
                                                        কুপন কোড
                                                    </h3>
                                                    {!appliedCoupon ? (
                                                        <div className="space-y-3">
                                                            <div className="flex flex-wrap ">
                                                                <input
                                                                    type="text"
                                                                    placeholder="কুপন কোড লিখুন"
                                                                    name="coupon"
                                                                    value={formData.coupon}
                                                                    onChange={handleInputChange}
                                                                    className="flex-1 px-4 py-2 border-2 border-purple-300 rounded-lg bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={applyCoupon}
                                                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                                >
                                                                    Apply
                                                                </button>

                                                            </div>
                                                            {couponError && (
                                                                <p className="text-red-500 text-sm flex items-center">
                                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                                                    </svg>
                                                                    {couponError}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-green-700 font-semibold flex items-center">
                                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                                                    </svg>
                                                                    কুপন প্রয়োগ হয়েছে: {appliedCoupon.code}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={removeCoupon}
                                                                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center transition-colors"
                                                                >
                                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                                                    </svg>
                                                                    সরান
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>                                            {/* Enhanced Submit Button */}
                                            <div className="pt-6">
                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl ${
                                                        isSubmitting
                                                            ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/25'
                                                    }`}
                                                    whileHover={!isSubmitting ? { 
                                                        scale: 1.05, 
                                                        boxShadow: "0 25px 50px -12px rgba(34, 135, 75, 0.5)",
                                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                                    } : {}}
                                                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}                                                    animate={isSubmitting ? { 
                                                        scale: [1, 0.95, 1],
                                                        opacity: 1, 
                                                        y: 0,
                                                        transition: { duration: 1, repeat: Infinity }
                                                    } : { opacity: 1, y: 0 }}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {isSubmitting ? (
                                                            <motion.div 
                                                                key="submitting"
                                                                className="flex items-center justify-center"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <motion.svg 
                                                                    className="-ml-1 mr-3 h-6 w-6 text-white" 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    fill="none" 
                                                                    viewBox="0 0 24 24"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                >
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </motion.svg>
                                                                প্রক্রিয়াকরণ হচ্ছে...
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div 
                                                                key="submit"
                                                                className="flex items-center justify-center"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <motion.svg 
                                                                    className="w-6 h-6 mr-2" 
                                                                    fill="currentColor" 
                                                                    viewBox="0 0 20 20"
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                                                                >
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                                </motion.svg>
                                                                অর্ডার সম্পন্ন করুন
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.button>
                                                <motion.p 
                                                    className="text-center text-sm text-gray-500 mt-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4 }}                                                >
                                                    ✓ নিরাপদ পেমেন্ট | ✓ দ্রুত ডেলিভারি | ✓ ১০০% নিশ্চয়তা
                                                </motion.p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>                    </div>
                </motion.div>

                {/* Footer */}
            </div>
                <footer className="bg-[#1e463e] text-white py-10 px-4 fade-in-up">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="slide-in-scale">
                                <h3 className="text-xl font-bold mb-4">যোগাযোগ</h3>
                                <p className="transition-colors duration-300 hover:text-green-400">ইমেইল: sahabastore130@gmail.com</p>
                                <p className="transition-colors duration-300 hover:text-green-400">ফোন: +8801334314465</p>
                                <p className="transition-colors duration-300 hover:text-green-400">ঠিকানা: Tongi,Gazipur, Dhaka, Bangladesh</p>
                            </div>
                            <div className="slide-in-scale" style={{animationDelay: '0.2s'}}>
                                <h3 className="text-xl font-bold mb-4">সামাজিক যোগাযোগ</h3>
                                <div className="flex space-x-4">
                                    <a href="https://www.facebook.com/sahabastore/" target='_blank' className="text-2xl transition-all duration-300 hover:scale-125 hover:text-blue-400"><i className="fab fa-facebook"></i></a>
                                    <a href="https://www.facebook.com/sahabastore/" target='_blank' className="text-2xl transition-all duration-300 hover:scale-125 hover:text-pink-400"><i className="fab fa-instagram"></i></a>
                                    <a href="https://wa.me/8801334314465?src=qr" target='_blank' className="text-2xl transition-all duration-300 hover:scale-125 hover:text-green-400"><i className="fab fa-whatsapp"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-600 mt-8 pt-6 text-center fade-in-up" style={{animationDelay: '0.4s'}}>
                            <p className="transition-colors duration-300 hover:text-green-400">© {new Date().getFullYear()}  Sahabastore - All Rights Reserved</p>
                        </div>
                    </div>
                </footer>
        </div>
    );
};

export default ProductDetailsNew;