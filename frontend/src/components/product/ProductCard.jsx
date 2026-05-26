import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';
import RatingStars from './RatingStars';
import resolveAssetUrl from '../../utils/resolveAssetUrl';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

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
        <RatingStars rating={product.rating || 0} />
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-saffron">{formatCurrency(product.price)}</span>
          <button type="button" className="btn-primary" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
