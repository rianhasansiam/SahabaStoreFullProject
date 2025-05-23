import { useState } from 'react';
import { FaTicketAlt, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { useFetchData } from '../../hooks/useFetchData';
import { usePostData } from '../../hooks/usePostData';
import { useUpdateData } from '../../hooks/useUpdateData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LoadingPage from '../../Conponents/LoadingPage';

const CouponManagement = () => {
  const { data, isLoading, isError, refetch } = useFetchData('coupons', '/coupons');

  const { mutate: addCoupon, isPending: isAdding } = usePostData('/add-coupon', { onSuccess: refetch });
  const { mutate: updateCoupon } = useUpdateData('/update-coupon', { onSuccess: refetch });
  const { mutate: deleteCoupon } = useDeleteData('/delete-coupon', { onSuccess: refetch });

  const [showModal, setShowModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minOrder: 0,
    expires: '',
    status: 'active',
  });

  const handleAddCoupon = () => {
    setCurrentCoupon(null);
    setForm({
      code: '',
      discount: '',
      type: 'percentage',
      minOrder: 0,
      expires: '',
      status: 'active',
    });
    setShowModal(true);
    
  };

  const handleEditCoupon = (coupon) => {
    setCurrentCoupon(coupon);
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      minOrder: coupon.minOrder,
      expires: coupon.expires,
      status: coupon.status,
    });
    setShowModal(true);
  };



  const handleSaveCoupon = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      discount: Number(form.discount),
      minOrder: Number(form.minOrder),
    };

    if (currentCoupon) {
      updateCoupon({ id: currentCoupon._id || currentCoupon.id, data: payload }, {
        onSuccess: () => {
          refetch();
          toast.success('Coupon updated successfully!');
        }
      });
    } else {
      addCoupon(payload, {
        onSuccess: () => {
          refetch();
          toast.success('Coupon added successfully!');
        }
      });
    }

    setShowModal(false);
  };



  const handleDeleteCoupon = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCoupon(id);
        toast.success('Coupon deleted successfully!');
        refetch();
      }
    });
  };

  const coupons = Array.isArray(data) ? data : [];

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
          <button
            onClick={handleAddCoupon}
            className="px-4 py-2 bg-[#22874b] text-white rounded-md hover:bg-[#54a0b1] transition-colors flex items-center gap-2"
          >
            <FaTicketAlt /> Add New Coupon
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by coupon code..."
            className="w-full max-w-sm px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading / Error */}
        {isLoading ? (
         <LoadingPage></LoadingPage>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load coupons. Please try again.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-scroll">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon._id || coupon.id}>
                    <td className="px-6 py-4 font-medium text-[#22874b]">{coupon.code}</td>
                    <td className="px-6 py-4">
                      {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                    </td>
                    <td className="px-6 py-4">{coupon.minOrder > 0 ? `$${coupon.minOrder}` : 'No minimum'}</td>
                    <td className="px-6 py-4">
                      {coupon.expires && !isNaN(new Date(coupon.expires))
                        ? new Date(coupon.expires).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        coupon.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 text-sm text-gray-500">
                      <button onClick={() => handleEditCoupon(coupon)} className="text-[#22874b] hover:text-[#5ea2b1]">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteCoupon(coupon._id || coupon.id)} className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onSubmit={handleSaveCoupon}
            >
              <h2 className="text-xl font-bold mb-4">
                {currentCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.code}
                    onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount *</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      value={form.discount}
                      onChange={(e) => setForm(f => ({ ...f, discount: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={form.type}
                      onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                      required
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.minOrder}
                    onChange={(e) => setForm(f => ({ ...f, minOrder: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.expires}
                    onChange={(e) => setForm(f => ({ ...f, expires: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={form.status}
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className={`px-4 py-2 text-white rounded-md ${isAdding ? 'bg-gray-400' : 'bg-[#22874b] hover:bg-[#63acbd]'}`}
                >
                  {currentCoupon ? 'Update Coupon' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
