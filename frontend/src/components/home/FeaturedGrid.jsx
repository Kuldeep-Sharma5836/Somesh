import ProductCard from '../product/ProductCard';

const FeaturedGrid = ({ products = [] }) => (
  <section className="mt-12">
    <h2 className="font-display text-3xl font-semibold text-maroon">Featured Products</h2>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </section>
);

export default FeaturedGrid;
