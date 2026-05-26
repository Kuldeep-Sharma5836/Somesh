const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[180px] items-center justify-center">
    <div className="flex items-center gap-3 text-maroon">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/40 border-t-saffron" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  </div>
);

export default Spinner;
