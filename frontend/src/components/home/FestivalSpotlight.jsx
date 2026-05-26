import ProductCard from '../product/ProductCard';

const FestivalSpotlight = ({ products = [] }) => (
  <section id="festival" className="mt-12 rounded-3xl border border-gold/25 bg-beige/50 p-6">
    <h2 className="font-display text-3xl font-semibold text-maroon">Festival Collection</h2>
    <p className="mt-2 max-w-2xl text-sm text-maroon/75">
      Curated festive essentials to make your celebrations soulful, warm, and memorable.
    </p>
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.slice(0, 3).map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  </section>
);

export default FestivalSpotlight;
