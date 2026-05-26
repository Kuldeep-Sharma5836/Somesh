const PhonePromptModal = ({ open, phone, onChange, onSave, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="font-display text-2xl font-semibold text-maroon">Add your phone</h2>
        <p className="mt-2 text-sm text-maroon/70">We need your phone number to complete signup.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <input
            type="tel"
            required
            placeholder="Phone number"
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={phone}
            onChange={(event) => onChange(event.target.value)}
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhonePromptModal;
