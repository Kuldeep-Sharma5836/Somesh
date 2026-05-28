import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import formatCurrency from '../../utils/formatCurrency';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await axiosClient.get('/products');
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    try {
      await axiosClient.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-3xl font-semibold text-maroon">Manage Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-maroon/70">
              <th className="py-2">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-b border-gold/15">
                <td className="py-3">{item.name}</td>
                <td>{item.category?.name}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>
                  <div className="space-y-1">
                    <span className="font-semibold">{item.countInStock}</span>
                    <div className="flex flex-wrap gap-2 text-xs text-maroon/70">
                      {(item.sizes || []).map((size) => (
                        <span key={size.size}>
                          {size.size}: {size.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="space-x-2">
                  <Link to={`/admin/products/${item._id}/edit`} className="text-saffron">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="text-maroon"
                    onClick={() => removeProduct(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
