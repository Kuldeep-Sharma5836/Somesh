const RatingStars = ({ rating = 0 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1 text-gold">
      {stars.map((star) => (
        <span key={star} className="text-sm">
          {rating >= star ? '★' : '☆'}
        </span>
      ))}
      <span className="ml-1 text-xs text-maroon/70">{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;
