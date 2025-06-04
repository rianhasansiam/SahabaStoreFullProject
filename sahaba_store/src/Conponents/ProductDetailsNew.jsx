import React, { useState, useEffect } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { useParams } from 'react-router-dom';

const ProductDetailsNew = () => {
    const { id } = useParams();
    const { data: product, isLoading, error } = useFetchData(
        'product',
        `/products/${id}`
    );
    
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        coupon: ''
    });

    // Reset selectedVariant if it's out of bounds when product data changes
    useEffect(() => {
        if (product?.priceVariants && selectedVariant >= product.priceVariants.length) {
            setSelectedVariant(0);
        }
    }, [product, selectedVariant]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading product</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="font-bangla bg-white text-gray-800">
            {/* Hero Banner */}
            <div className="relative">
                <div className="bg-[#2fa05c] h-[20vh] w-full rounded-b-3xl"></div>
                <div className="bg-[#22874b] w-[90%] md:w-[70vw] mx-auto shadow-lg rounded-xl py-6 absolute top-[15vh] left-1/2 transform -translate-x-1/2">
                    <h1 className="text-center text-white text-2xl md:text-4xl font-extrabold">
                        {product.name}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 mt-32 md:mt-40">
                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300">
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
                <div className="bg-[#2fa05c] w-full py-3 my-10">
                    <h1 className="bg-white text-lg md:text-xl font-bold px-4 ml-4 inline-block">
                        - চুলের যত্নে - ফেইস ও স্কিনের যত্নে - দেহের অজানা আরও অনেক সমস্যা সমাধানে
                    </h1>
                </div>

                {/* Hadith Section */}
                <div className="border-4 border-black w-full md:w-[70vw] mx-auto py-6 md:py-10 text-center font-extrabold text-xl md:text-3xl rounded-3xl my-10 shadow-lg">
                    বিশ্বনবী হযরত মুহাম্মদ ﷺ বলেছেন, "এই 'কালোজিরা' মৃত্যু ব্যতিত সকল রোগের মহাঔষধ।" 
                    <span className="text-red-500 block md:inline">-সহীহ বুখারী, ৫২৮৫</span>
                </div>

                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300">
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
                </div>

                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300">
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
                        <div className="flex overflow-x-auto gap-4 py-2">
                            {[
                                "https://i.ibb.co/twn1ZqWk/Whats-App-Image-2025-05-31-at-1-49-50-PM.jpg",
                                "https://i.ibb.co/Zz3PxbKn/Whats-App-Image-2025-05-31-at-1-49-55-PM.jpg",
                                "https://i.ibb.co/tw6KqssK/Whats-App-Image-2025-05-31-at-1-50-00-PM.jpg",
                                "https://i.ibb.co/1t6btXfC/Whats-App-Image-2025-05-31-at-1-50-05-PM.jpg",
                                "https://i.ibb.co/fdS5nvhd/Whats-App-Image-2025-05-31-at-1-50-14-PM.jpg",
                                "https://i.ibb.co/0yc0Hfc1/Whats-App-Image-2025-05-31-at-1-50-20-PM.jpg",
                                "https://i.ibb.co/4w05z8pj/Whats-App-Image-2025-05-31-at-1-50-25-PM.jpg",
                                "https://i.ibb.co/cXT0c76P/Whats-App-Image-2025-05-31-at-1-50-33-PM.jpg",
                                "https://i.ibb.co/fdM0CRQB/Whats-App-Image-2025-05-31-at-1-50-41-PM.jpg",
                                "https://i.ibb.co/n8PJHxZt/Whats-App-Image-2025-05-31-at-1-50-51-PM.jpg"
                            ].map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt={`Customer review ${index + 1}`}
                                    className="h-40 rounded-lg shadow-sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Now Button */}
                <div className="text-center my-8">
                    <button className="bg-[#ffe500] hover:bg-[#f5d900] text-[#1e463e] font-bold text-lg md:text-xl py-4 px-12 rounded-full shadow-lg transition duration-300">
                        <i className="fa-solid fa-cart-shopping mr-3"></i> অর্ডার করুন
                    </button>
                </div>

                {/* Order Form Section */}
                <div className="my-16 bg-gray-50 p-6 md:p-10 rounded-xl">
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
                                                    {variant.size || `Variant ${index + 1}`} - {variant.price || 'N/A'}
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
                                    </div>
                                </div>                                <div className="text-xl font-bold">
                                    মোট: {getPrice() > 0 ? 
                                        (getPrice() * quantity) + '৳' : 
                                        'Price not available'}
                                </div>
                            </div>
                        </div>

                        {/* Customer Form */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4 text-[#22874b]">গ্রাহক তথ্য</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1">আপনার নাম</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-300 p-2 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">আপনার ফোন নম্বর</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-300 p-2 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">আপনার ঠিকানা</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-300 p-2 rounded-md"
                                            rows="3"
                                            required
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block mb-1">কুপন কোড (যদি থাকে)</label>
                                        <input
                                            type="text"
                                            name="coupon"
                                            value={formData.coupon}
                                            onChange={handleInputChange}
                                            className="w-full border-2 border-gray-300 p-2 rounded-md"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#22874b] hover:bg-[#1e6e3d] text-white font-bold py-3 px-6 mt-6 rounded-full shadow-lg w-full transition duration-300"
                                >
                                    অর্ডার নিশ্চিত করুন
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
                            <p>ইমেইল: info@zaituni.net</p>
                            <p>ফোন: +880XXXXXXXXXX</p>
                            <p>ঠিকানা: ঢাকা, বাংলাদেশ</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">গুরুত্বপূর্ণ লিংক</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">প্রাইভেসি পলিসি</a></li>
                                <li><a href="#" className="hover:underline">রিটার্ন পলিসি</a></li>
                                <li><a href="#" className="hover:underline">শর্তাবলী</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">সামাজিক যোগাযোগ</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-2xl"><i className="fab fa-facebook"></i></a>
                                <a href="#" className="text-2xl"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-2xl"><i className="fab fa-whatsapp"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-600 mt-8 pt-6 text-center">
                        <p>© {new Date().getFullYear()} Zaituni. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ProductDetailsNew;