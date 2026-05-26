import { Link } from 'react-router-dom';

const CategoryStrip = ({ categories = [] }) => (
  <section className="mt-12">
    <div className="mb-4 flex items-end justify-between">
      <h2 className="font-display text-3xl font-semibold text-maroon">Spiritual Categories</h2>
      <Link to="/products" className="text-sm font-semibold text-saffron">
        View all
      </Link>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/products?category=${category._id}`}
          className="rounded-xl border border-gold/20 bg-white px-4 py-4 text-sm font-semibold text-maroon shadow-soft transition hover:-translate-y-1 hover:border-saffron"
        >
          {category.name}
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryStrip;
