import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/product/ProductCard';
import Spinner from '../../components/common/Spinner';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '0',
      maxPrice: searchParams.get('maxPrice') || '100000',
    }),
    [searchParams]
  );

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [catRes, productRes] = await Promise.all([
        axiosClient.get('/categories'),
        axiosClient.get('/products', { params: filters }),
      ]);
      setCategories(catRes.data);
      setProducts(productRes.data);
      setLoading(false);
    };

    fetchData();
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice]);

  return (
    <section>
      <div className="mb-6 rounded-2xl border border-gold/20 bg-white p-4 shadow-soft">
        <h1 className="font-display text-3xl font-semibold text-maroon">All Products</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search products"
            className="rounded-lg border border-gold/30 px-3 py-2 text-sm"
          />
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="rounded-lg border border-gold/30 px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            type="number"
            placeholder="Min Price"
            className="rounded-lg border border-gold/30 px-3 py-2 text-sm"
          />
          <input
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            type="number"
            placeholder="Max Price"
            className="rounded-lg border border-gold/30 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
