import { useState, useRef } from 'react';
import { FaSearch, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { useFetchData } from '../../hooks/useFetchData';
import { usePostData } from '../../hooks/usePostData';
import { useUpdateData } from '../../hooks/useUpdateData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LoadingPage from '../../Conponents/LoadingPage';

const AllProducts = () => {
  const [productForm, setProductForm] = useState({
    productId: '',
    name: '',
    availableAmount: '',
    description: '',
    price: '',
    category: '',
    thumbnail: '',
    images: [],
    shortDescription: '',
    priceVariants: []
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const thumbnailInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Fetch categories and products
  const { data: categories = [], isLoading: isCategoriesLoading } = useFetchData('categories', '/allcategories');
  const { data: products = [], isLoading, isError, refetch } = useFetchData('products', '/products');

  // Mutation hooks
  const { mutate: addProduct, isPending: isAdding } = usePostData('/add-product');
  const { mutate: updateProduct } = useUpdateData('/update-product');
  const { mutate: deleteProduct } = useDeleteData('/delete-product');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPriceVariant = () => {
    setProductForm(prev => ({
      ...prev,
      priceVariants: [...prev.priceVariants, { quantity: '', price: '' }]
    }));
  };

  const handleRemovePriceVariant = (index) => {
    setProductForm(prev => ({
      ...prev,
      priceVariants: prev.priceVariants.filter((_, i) => i !== index)
    }));
  };

  const handlePriceVariantChange = (index, field, value) => {
    setProductForm(prev => {
      const updatedVariants = [...prev.priceVariants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      };
      return {
        ...prev,
        priceVariants: updatedVariants
      };
    });
  };

  const handleImageUpload = async (e, type) => {
    const files = type === 'thumbnail' ? [e.target.files[0]] : Array.from(e.target.files);
    if (files.length === 0 || !files[0]) return;

    // Validate files
    for (const file of files) {
      if (!file.type.match('image.*')) {
        toast.error('Please select only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
    }

    // Check limits
    if (type === 'gallery' && productForm.images.length + files.length > 5) {
      toast.error('You can upload maximum 5 additional images');
      return;
    }

    try {
      setIsUploading(true);
      setCurrentUploadType(type);
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const imgbbResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: 'POST', body: formData }
        );
        const imgbbData = await imgbbResponse.json();

        if (imgbbData.success) {
          uploadedUrls.push(imgbbData.data.url);
        } else {
          throw new Error(imgbbData.error?.message || 'Failed to upload image');
        }
      }

      if (type === 'thumbnail') {
        setProductForm(prev => ({ ...prev, thumbnail: uploadedUrls[0] }));
        toast.success('Thumbnail uploaded successfully!');
      } else {
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
        toast.success(`${uploadedUrls.length} image(s) added to gallery!`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      setCurrentUploadType(null);
      if (type === 'thumbnail' && thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
      if (type === 'gallery' && galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index, type) => {
    if (type === 'thumbnail') {
      setProductForm(prev => ({ ...prev, thumbnail: '' }));
    } else {
      setProductForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = () => {    if (!productForm.name || !productForm.productId) {
      toast.error('Product ID and Name are required');
      return;
    }    
    
    if (!productForm.category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!productForm.thumbnail) {
      toast.error('Thumbnail image is required');
      return;
    }
    
    // Always validate the price field
    if (!productForm.price) {
      toast.error('Please enter a price range for the product');
      return;
    }const invalidVariants = productForm.priceVariants.some(
      variant => !variant.quantity || !variant.price || isNaN(variant.price)
    );
    
    if (invalidVariants) {
      toast.error('Please fill all quantity and price fields for variants with valid numbers');
      return;
    }    // Prepare the payload
    const payload = {
      ...productForm,
      // Always keep price as string to support ranges like "100-500", regardless of variants
      price: productForm.price,
      availableAmount: parseInt(productForm.availableAmount) || 0,
      category: productForm.category || null,
      priceVariants: productForm.priceVariants.map(variant => ({
        quantity: variant.quantity,
        price: parseFloat(variant.price) || 0
      }))
    };

    if (editMode) {
      updateProduct(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            toast.success('Product updated successfully!');
            refetch();
            resetForm();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
          }
        }
      );
    } else {
      addProduct(payload, {
        onSuccess: () => {
          toast.success('Product added successfully!');
          refetch();
          resetForm();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to add product');
        }
      });
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      productId: product.productId,
      name: product.name,
      availableAmount: product.availableAmount,
      description: product.description,
      price: product.price?.toString() || '',
      category: product.category?._id || product.category || '',
      thumbnail: product.thumbnail || '',
      images: product.images || [],
      shortDescription: product.shortDescription || '',
      priceVariants: product.priceVariants || []
    });
    setEditMode(true);
    setEditId(product._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Product?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id, {
          onSuccess: () => {
            toast.success('Product deleted!');
            refetch();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
          }
        });
      }
    });
  };

  const resetForm = () => {
    setProductForm({
      productId: '',
      name: '',
      availableAmount: '',
      description: '',
      price: '',
      category: '',
      thumbnail: '',
      images: [],
      shortDescription: '',
      priceVariants: []
    });
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const filteredProducts = products.filter(product => {
    const name = product.name?.toLowerCase() || '';
    const productId = product.productId?.toLowerCase() || '';
    const categoryName = getCategoryName(product.category).toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      productId.includes(searchTerm.toLowerCase()) ||
      categoryName.includes(searchTerm.toLowerCase())
    );
  });  const renderProductPrice = (product) => {
    let priceDisplay = [];
    
    // Always show the price range if it exists
    if (product.price) {
      priceDisplay.push(<div key="base-price" className="font-semibold">{product.price} BDT</div>);
    }

    // Add variants if they exist
    if (product.priceVariants?.length > 0) {
      priceDisplay.push(
        <div key="variants" className="text-xs space-y-1 mt-1">
          {product.priceVariants.map((variant, index) => (
            <div key={index}>
              {variant.quantity}: {parseFloat(variant.price).toFixed(2)} BDT
            </div>
          ))}
        </div>
      );
    }
    
    return priceDisplay.length > 0 ? priceDisplay : 'Price not set';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#22874b] text-white rounded-md hover:bg-[#519fb1] transition-colors"
          disabled={isCategoriesLoading}
        >
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2 max-w-md">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, product ID, or category..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl overflow-y-auto max-h-screen">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <div className="space-y-4">
              {/* Product ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <input
                  type="text"
                  name="productId"
                  value={productForm.productId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="PROD-001"
                  required
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter product name"
                  required
                />
              </div>              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>{/* Base Price - Always show this field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (BDT) *
                </label>
                <input
                  type="text"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="100-500"
                  required={productForm.priceVariants.length === 0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a price range (e.g., 100-500)
                </p>
              </div>

              {/* Price Variants */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity Variants
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPriceVariant}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FaPlus className="mr-1" /> Add Quantity
                  </button>
                </div>

                {productForm.priceVariants.length === 0 ? (
                  <p className="text-xs text-gray-500">No quantity variants added</p>
                ) : (
                  <div className="space-y-3">
                    {productForm.priceVariants.map((variant, index) => (
                      <div key={index} className="grid grid-cols-5 gap-3 items-center">
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={variant.quantity}
                            onChange={(e) => handlePriceVariantChange(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="e.g. 250ml, 500g"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) => handlePriceVariantChange(index, 'price', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => handleRemovePriceVariant(index)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Quantity
                </label>
                <input
                  type="number"
                  name="availableAmount"
                  value={productForm.availableAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0"
                  min="0"
                />
              </div>
              
              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={productForm.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Short Description...."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image *
                </label>
                {productForm.thumbnail ? (
                  <div className="mt-2">
                    <img 
                      src={productForm.thumbnail} 
                      alt="Thumbnail preview" 
                      className="h-32 w-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(null, 'thumbnail')}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Thumbnail
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="thumbnail-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload thumbnail</span>
                          <input
                            id="thumbnail-upload"
                            name="thumbnail-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleImageUpload(e, 'thumbnail')}
                            ref={thumbnailInputRef}
                            accept="image/*"
                            disabled={isUploading && currentUploadType === 'thumbnail'}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {isUploading && currentUploadType === 'thumbnail' && (
                        <p className="text-xs text-blue-500">Uploading thumbnail...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images (Max 5)
                </label>
                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {productForm.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Product image ${index + 1}`} 
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, 'gallery')}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                        >
                          <FaTimes className="text-red-500 text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="gallery-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload additional images</span>
                        <input
                          id="gallery-upload"
                          name="gallery-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          ref={galleryInputRef}
                          accept="image/*"
                          disabled={isUploading && currentUploadType === 'gallery' || productForm.images.length >= 5}
                          multiple
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                    {isUploading && currentUploadType === 'gallery' && (
                      <p className="text-xs text-blue-500">Uploading images...</p>
                    )}
                    {productForm.images.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {productForm.images.length}/5 images uploaded
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isAdding || isUploading}
                className={`px-4 py-2 text-white rounded-md ${
                  isAdding || isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editMode ? 'Update' : isAdding ? 'Adding...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <LoadingPage></LoadingPage>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            Failed to load products. Please try again.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No products found. Add your first product!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt="Thumbnail" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Thumbnail</span>
                        </div>
                      )}
                      {product.images?.length > 0 && (
                        <span className="ml-1 text-xs text-gray-500">+{product.images.length}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderProductPrice(product)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.availableAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availableAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[#22874b] hover:text-[#5da5b6]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;