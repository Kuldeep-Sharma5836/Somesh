import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    const { data } = await axiosClient.get('/categories');
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/categories', { name });
      setName('');
      fetchCategories();
      toast.success('Category added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
      toast.success('Category removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove category');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon">Manage Categories</h1>
      <form className="mt-4 flex flex-wrap gap-3" onSubmit={createCategory}>
        <label className="text-sm font-semibold text-maroon">
          Category Name
          <input
            id="category-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="mt-2 w-72 rounded-lg border border-gold/30 px-3 py-2 text-sm"
          />
        </label>
        <button type="submit" className="btn-primary">
          Add Category
        </button>
      </form>
      <div className="mt-5 space-y-2">
        {categories.map((category) => (
          <article
            key={category._id}
            className="flex items-center justify-between rounded-lg border border-gold/20 p-3"
          >
            <p className="text-sm font-semibold text-maroon">{category.name}</p>
            <button type="button" className="text-sm text-maroon" onClick={() => deleteCategory(category._id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
