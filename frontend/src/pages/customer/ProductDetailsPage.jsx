import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/common/Spinner';
import RatingStars from '../../components/product/RatingStars';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import formatCurrency from '../../utils/formatCurrency';
import resolveAssetUrl from '../../utils/resolveAssetUrl';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosClient.get(`/products/${id}`);
        setProduct(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted');
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit review');
    }
  };

  if (loading) return <Spinner label="Loading product details..." />;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <img
          src={resolveAssetUrl(product.images?.[0]) || 'https://via.placeholder.com/600x480'}
          alt={product.name}
          className="h-[430px] w-full rounded-2xl object-cover"
        />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {(product.images || []).slice(0, 4).map((img) => (
            <img
              key={img}
              src={resolveAssetUrl(img)}
              alt="preview"
              className="h-20 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      </div>

      <div className="card h-fit">
        <p className="text-xs uppercase tracking-[0.22em] text-maroon/65">{product.category?.name}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-maroon">{product.name}</h1>
        <div className="mt-2">
          <RatingStars rating={product.rating || 0} />
        </div>
        <p className="mt-4 text-sm leading-6 text-maroon/80">{product.description}</p>
        <p className="mt-5 text-3xl font-bold text-saffron">{formatCurrency(product.price)}</p>

        <div className="mt-4 flex items-center gap-3">
          <label htmlFor="qty" className="text-sm font-semibold text-maroon">
            Quantity
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={product.countInStock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 rounded-lg border border-gold/30 px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" className="btn-primary" onClick={() => addToCart(product, qty)}>
            Add to Cart
          </button>
          <button type="button" className="btn-secondary" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>

        <section className="mt-8 border-t border-gold/20 pt-6">
          <h2 className="font-display text-2xl font-semibold text-maroon">Reviews</h2>
          <div className="mt-3 space-y-3">
            {(product.reviews || []).length === 0 && <p className="text-sm text-maroon/70">No reviews yet.</p>}
            {(product.reviews || []).map((item) => (
              <article key={item._id} className="rounded-lg bg-beige/40 p-3">
                <p className="text-sm font-semibold text-maroon">{item.name}</p>
                <p className="text-xs text-maroon/70">{item.comment}</p>
              </article>
            ))}
          </div>

          {isAuthenticated && (
            <form className="mt-4 space-y-3" onSubmit={submitReview}>
              <select
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Stars
                  </option>
                ))}
              </select>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                placeholder="Share your experience"
                className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
              />
              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
