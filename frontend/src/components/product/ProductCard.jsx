import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';
import RatingStars from './RatingStars';
import resolveAssetUrl from '../../utils/resolveAssetUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const sizes = product.sizes?.length
    ? product.sizes
    : [
        { size: 'S', qty: product.countInStock },
        { size: 'M', qty: product.countInStock },
        { size: 'L', qty: product.countInStock },
      ];
  const firstAvailable = sizes.find((item) => item.qty > 0) || sizes[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="card overflow-hidden"
    >
      <Link to={`/products/${product._id}`}>
        <img
          src={resolveAssetUrl(product.images?.[0]) || 'https://via.placeholder.com/300x260'}
          alt={product.name}
          className="h-52 w-full rounded-xl object-cover"
        />
      </Link>

      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-maroon/65">
          {product.category?.name || 'Spiritual Collection'}
        </p>
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-2 font-display text-xl font-semibold text-maroon"
        >
          {product.name}
        </Link>
        <div className="flex flex-wrap gap-2">
          {sizes.map((item) => (
            <span
              key={item.size}
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                item.qty === 0 ? 'border-gold/20 text-maroon/40' : 'border-gold/30 text-maroon'
              }`}
            >
              {item.size}: {item.qty}
            </span>
          ))}
        </div>
        <RatingStars rating={product.rating || 0} />
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-saffron">{formatCurrency(product.price)}</span>
          <button
            type="button"
            className="btn-primary"
            onClick={() => addToCart(product, 1, firstAvailable?.size || 'M')}
            disabled={!firstAvailable || firstAvailable.qty === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
