import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import resolveAssetUrl from '../../utils/resolveAssetUrl';

const defaultForm = {
  name: '',
  description: '',
  price: 0,
  countInStock: 0,
  brand: 'DivineAura',
  category: '',
  images: [],
  isFeatured: false,
};

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoryData } = await axiosClient.get('/categories');
      setCategories(categoryData);

      if (id) {
        const { data } = await axiosClient.get(`/products/${id}`);
        setForm({ ...data, category: data.category?._id || '' });
      }
    };

    fetchData();
  }, [id]);

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);

    try {
      const { data } = await axiosClient.post('/upload', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({ ...form, images: [...(form.images || []), data.imageUrl] });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axiosClient.put(`/products/${id}`, form);
        toast.success('Product updated');
      } else {
        await axiosClient.post('/products', form);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save product');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon">{id ? 'Edit' : 'Add'} Product</h1>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={submit}>
        <label className="text-sm font-semibold text-maroon">
          Product Name
          <input
            id="product-name"
            required
            placeholder="Product name"
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="text-sm font-semibold text-maroon">
          Price
          <input
            id="product-price"
            required
            type="number"
            placeholder="Price"
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </label>
        <label className="text-sm font-semibold text-maroon">
          Stock Count
          <input
            id="product-stock"
            required
            type="number"
            placeholder="Stock"
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.countInStock}
            onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) })}
          />
        </label>
        <label className="text-sm font-semibold text-maroon">
          Category
          <select
            id="product-category"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-maroon">
          Brand
          <input
            id="product-brand"
            placeholder="Brand"
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-maroon">
          <input
            type="checkbox"
            checked={Boolean(form.isFeatured)}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured Product
        </label>
        <label className="md:col-span-2 text-sm font-semibold text-maroon">
          Description
          <textarea
            id="product-description"
            required
            placeholder="Description"
            className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>

        <label className="md:col-span-2 text-sm font-semibold text-maroon">
          Upload Image
          <input id="product-image" type="file" className="mt-2 block" onChange={uploadImage} />
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-2">
          {(form.images || []).map((image) => (
            <img
              key={image}
              src={resolveAssetUrl(image)}
              alt="product"
              className="h-16 w-16 rounded object-cover"
            />
          ))}
        </div>

        <button type="submit" className="btn-primary md:col-span-2 w-full sm:w-fit">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
