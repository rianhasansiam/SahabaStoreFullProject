import { useState, useRef } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { usePostData } from '../../hooks/usePostData';
import { useUpdateData } from '../../hooks/useUpdateData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LoadingPage from '../../Conponents/LoadingPage';

const AllCategories = () => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    availableAmount: '',
    image: '',
  });

  // Modal and edit state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Custom hooks
  const { data: categories = [], isLoading, isError, refetch } = useFetchData('categories', '/allcategories');

  const { mutate: addCategory, isPending: isAdding } = usePostData('/add-category');
  const { mutate: updateCategory } = useUpdateData('/edit-category');
  const { mutate: deleteCategory } = useDeleteData('/delete-category');

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setCategoryForm((prev) => ({ ...prev, image: data.data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setCategoryForm((prev) => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = () => {
    const { name, availableAmount, image } = categoryForm;
    if (!name || !availableAmount) {
      toast.error('Please fill all fields');
      return;
    }

    const payload = { name, availableAmount, image };

    if (editMode) {
      updateCategory(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            toast.success('Category updated!');
            refetch();
            setShowModal(false);
            setCategoryForm({ name: '', availableAmount: '', image: '' });
            setEditMode(false);
            setEditId(null);
          },
        }
      );
    } else {
      addCategory(payload, {
        onSuccess: () => {
          toast.success('Category added!');
          refetch();
          setShowModal(false);
          setCategoryForm({ name: '', availableAmount: '', image: '' });
        },
      });
    }
  };

  // Open modal to edit
  const handleEdit = (cat) => {
    setCategoryForm({
      name: cat.name,
      availableAmount: cat.availableAmount,
      image: cat.image || '',
    });
    setEditMode(true);
    setEditId(cat._id);
    setShowModal(true);
  };

  // Delete category
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCategory(id, {
          onSuccess: () => {
            toast.success('Category deleted!');
            refetch();
          },
        });
      }
    });
  };

  return (
    <div>
      <div className='flex justify-between items-center'>

      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      {/* Add Button */}
     
        <button
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setCategoryForm({ name: '', availableAmount: '', image: '' });
          }}
          className="px-4 py-2 bg-[#22874b] text-white rounded-md hover:bg-[#347e8f]"
        >
          Add Category
        </button>
   
        
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 ">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Category' : 'Add New Category'}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="w-full mb-3 px-4 py-2 border rounded-md"
              value={categoryForm.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="availableAmount"
              placeholder="Available Amount"
              className="w-full mb-4 px-4 py-2 border rounded-md"
              value={categoryForm.availableAmount}
              onChange={handleInputChange}
            />

            {/* Image upload section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Image
              </label>
              {categoryForm.image ? (
                <div className="mt-2">
                  <img
                    src={categoryForm.image}
                    alt="Preview"
                    className="h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                          ref={fileInputRef}
                          accept="image/*"
                          disabled={isUploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    {isUploading && <p className="text-xs text-blue-500">Uploading...</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
  disabled={isUploading || isAdding}
  onClick={handleSubmit}
  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {editMode ? 'Update' : isAdding ? 'Submitting...' : 'Submit'}
</button>

            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-scroll">
        {isLoading ? (
          <LoadingPage></LoadingPage>
        ) : isError ? (
          <p className="p-4 text-red-500">Failed to load categories.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-12 w-12 object-cover rounded-full" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.availableAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
