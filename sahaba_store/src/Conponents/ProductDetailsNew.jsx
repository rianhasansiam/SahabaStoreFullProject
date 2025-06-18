// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import React, { useState, useEffect, useRef } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { usePostData } from '../hooks/usePostData';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';









const ProductDetailsNew = () => {
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
    const [couponError, setCouponError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        coupon: ''
    });    // Reset selectedVariant if it's out of bounds when product data changes
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
            
            // Validate required fields
            const newErrors = {};
            
            if (!formData.name.trim()) {
                newErrors.name = 'নাম প্রয়োজন';
            }
            
            if (!formData.phone.trim()) {
                newErrors.phone = 'ফোন নম্বর প্রয়োজন';
            } else {
                // Validate phone number (Bangladeshi format)
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

            // Calculate prices
            const itemPrice = getPrice();
            const subtotal = itemPrice * quantity;
            const finalTotal = subtotal - discount;

            // Create order object matching CheckoutPage format
            const orderData = {
                customer: {
                    name: formData.name.trim(),
                    phone: formData.phone,
                },
                shipping: {
                    address: formData.address.trim(),
                },
                payment: {
                    method: 'cash-on-delivery',
                    status: 'pending',
                },
                products: [{
                    productId: product._id,
                    name: product.name,
                    price: itemPrice,
                    quantity: quantity,
                    image: product.thumbnail || product.images?.[0],
                    size: product.priceVariants?.[selectedVariant]?.size || "250 ml",
                    totalPrice: itemPrice * quantity
                }],
                coupon: appliedCoupon ? {
                    code: appliedCoupon.code,
                    discount: discount,
                    type: appliedCoupon.type
                } : null,
                subtotal: subtotal,
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
                coupon: ''
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
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading product</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="font-bangla bg-white text-gray-800">
            {/* Hero Banner */}
            <div className="relative">
                <div className="bg-[#2fa05c] h-[15vh] md:h-[20vh]  rounded-b-3xl mt-1 mx-1 md:mx-2 "></div>
                <div className="bg-[#22874b] w-[90%] md:w-[70vw] mx-auto shadow-lg rounded-xl py-6 absolute top-[10vh] md:top-[15vh] left-1/2 transform -translate-x-1/2">
                    <h1 className="text-center text-white text-xl md:text-4xl font-extrabold">
                        {product.name}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 mt-32 md:mt-40">
                {/* Order Now Button */}                <div className="text-center my-8">
                    <button 
                        onClick={scrollToOrderForm}
                        className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300"
                    >
                        <i className="fa-solid fa-cart-shopping mr-3"></i> অর্ডার করুন
                    </button>
                </div>                {/* YouTube Video Section */}
                <div className="my-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#22874b]">
                        গ্রাহকদের অভিজ্ঞতা
                    </h2>
                    <div className="relative w-full max-w-4xl mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                        <div className="relative pb-[56.25%] h-0"> {/* 16:9 aspect ratio */}
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/4UBUqeRjBoQ" 
                                title="Zaituni Kalojira Oil Feedbacks from Repeated Consumers!" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerPolicy="strict-origin-when-cross-origin" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    <p className="text-center mt-4 text-gray-600 text-sm md:text-base">
                        আমাদের নিয়মিত গ্রাহকদের প্রকৃত অভিজ্ঞতা এবং মতামত শুনুন
                    </p>
                </div>

                {/* Benefits Banner */}
                <div className="bg-[#95cfac] w-full py-3 my-10 rounded-xl ">
                    <h1 className="bg-white text-lg md:text-xl font-bold px-4 ml-4 inline-block">
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
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                    <div>
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
                    </div>
                    <div className="flex justify-center">
                        <img 
                            src={product.images[0] || product.thumbnail} 
                            alt={product.name}
                            className="rounded-lg shadow-md max-h-96"
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
                </div>

                {/* Order Form Section */}
                <div className="my-16 bg-gray-50 p-6 md:p-10 rounded-xl" ref={orderFormRef}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#22874b]">
                        অর্ডার করতে নিচের ফর্মটি পূরণ করুন
                    </h2>
                    <p className="text-center mb-8">
                        "আপনি রিটার্নিং কাস্টমার (আমাদের ওয়েবসাইটে দ্বিতীয় বা ততোধিক অর্ডার) হলে ফ্রি ডেলিভারি পেতে আপনার কাছে থাকা কুপন কোডটি ব্যবহার করুন"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Selection */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-[#22874b]">পণ্য নির্বাচন করুন</h3>
                            <div className="mb-6">
                                <img 
                                    src={product.thumbnail} 
                                    alt={product.name}
                                    className="w-full h-auto rounded-lg mb-4"
                                />
                                <h4 className="text-lg font-semibold">{product.name}</h4>
                                <p className="text-gray-600 mb-4">{product.shortDescription}</p>
                                
                                {product.priceVariants && product.priceVariants.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block mb-2 font-medium">ভ্যারিয়েন্ট নির্বাচন করুন:</label>
                                        <div className="flex flex-wrap gap-2">                                            {product.priceVariants.map((variant, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedVariant(index)}
                                                    className={`px-4 py-2 rounded-full border ${selectedVariant === index ? 'bg-[#22874b] text-white border-[#22874b]' : 'bg-white border-gray-300'}`}
                                                >
                                                    {variant?.quantity || `Variant ${index + 1}`} - {variant.price || 'N/A'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center mb-4">
                                    <label className="mr-4 font-medium">পরিমাণ:</label>
                                    <div className="flex border rounded-full overflow-hidden">
                                        <button 
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>                                </div>
                            </div>
                        </div>

                        {/* Customer Form */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-[#22874b]">গ্রাহক তথ্য</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">                                    <div>
                                        <label className="block mb-1">আপনার নাম</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full border-2 p-2 rounded-md bg-gray-100 ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block mb-1">আপনার ফোন নম্বর</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full border-2 p-2 rounded-md bg-gray-100 ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>                                    <div>
                                        <label className="block mb-1">আপনার ঠিকানা</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className={`w-full border-2 p-2 rounded-md bg-gray-100 ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            rows="3"
                                            required
                                        ></textarea>
                                        {errors.address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                        )}
                                    </div>                                    <div>
                                        <label className="block mb-1">কুপন কোড (যদি থাকে)</label>
                                        {!appliedCoupon ? (
                                            <div>
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        name="coupon"
                                                        value={formData.coupon}
                                                        onChange={handleInputChange}
                                                        placeholder="কুপন কোড লিখুন"
                                                        className="flex-1 border-2 border-gray-300 p-2 rounded-l-md bg-gray-100"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={applyCoupon}
                                                        className="bg-[#22874b] text-white px-4 py-2 rounded-r-md hover:bg-[#1e6e3d] transition"
                                                    >
                                                        প্রয়োগ করুন
                                                    </button>
                                                </div>
                                                {couponError && (
                                                    <p className="text-red-500 text-sm mt-1">{couponError}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-green-700 font-medium">
                                                        কুপন প্রয়োগ করা হয়েছে: {appliedCoupon.code}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={removeCoupon}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        সরান
                                                    </button>
                                                </div>
                                                <p className="text-green-600 text-sm mt-1">
                                                    ছাড়: ৳{discount.toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>পণ্যের দাম:</span>
                                            <span>৳{getPrice().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>পরিমাণ:</span>
                                            <span>{quantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>সাবটোটাল:</span>
                                            <span>৳{(getPrice() * quantity).toFixed(2)}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-green-600">
                                                <span>কুপন ছাড়:</span>
                                                <span>-৳{discount.toFixed(2)}</span>
                                            </div>
                                        )}                                        <div className="flex justify-between border-t pt-2 font-bold text-lg">
                                            <span>মোট:</span>
                                            <span>৳{getFinalTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div><button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`${
                                        isSubmitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-[#22874b] hover:bg-[#1e6e3d]'
                                    } text-white font-bold py-3 px-6 mt-6 rounded-full shadow-lg w-full transition duration-300`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            প্রক্রিয়াকরণ হচ্ছে...
                                        </>
                                    ) : (
                                        'অর্ডার নিশ্চিত করুন'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#1e463e] text-white py-10 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">যোগাযোগ</h3>
                            <p>ইমেইল: sahabastore130@gmail.com</p>
                            <p>ফোন: +8801334314465</p>
                            <p>ঠিকানা: Tongi,Gazipur, Dhaka, Bangladesh</p>
                        </div>
                        {/* <div>
                            <h3 className="text-xl font-bold mb-4">গুরুত্বপূর্ণ লিংক</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">প্রাইভেসি পলিসি</a></li>
                                <li><a href="#" className="hover:underline">রিটার্ন পলিসি</a></li>
                                <li><a href="#" className="hover:underline">শর্তাবলী</a></li>
                            </ul>
                        </div> */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">সামাজিক যোগাযোগ</h3>
                            <div className="flex space-x-4">
                                <a href="https://www.facebook.com/sahabastore/" target='_blank' className="text-2xl"><i className="fab fa-facebook"></i></a>
                                <a href="https://www.facebook.com/sahabastore/" target='_blank' className="text-2xl"><i className="fab fa-instagram"></i></a>
                                <a href="https://www.facebook.com/sahabastore/" target='_blank' className="text-2xl"><i className="fab fa-whatsapp"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-600 mt-8 pt-6 text-center">
                        <p>© {new Date().getFullYear()}  Sahabastore - All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetailsNew;