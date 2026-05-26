const data = [
  {
    name: 'Ananya Sharma',
    city: 'Jaipur',
    review: 'The brass pooja thali is premium and exactly as shown. Packaging was very safe and elegant.',
  },
  {
    name: 'Rohit Iyer',
    city: 'Bengaluru',
    review: 'Loved the sandalwood incense. DivineAura has become my go-to store for festival shopping.',
  },
  {
    name: 'Mira Patel',
    city: 'Ahmedabad',
    review: 'Beautiful rudraksha mala quality and fast delivery. The website experience is smooth on mobile too.',
  },
];

const Testimonials = () => (
  <section className="mt-12">
    <h2 className="font-display text-3xl font-semibold text-maroon">What Devotees Say</h2>
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      {data.map((item) => (
        <article key={item.name} className="card">
          <p className="text-sm text-maroon/85">"{item.review}"</p>
          <p className="mt-4 text-sm font-semibold text-saffron">{item.name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-maroon/60">{item.city}</p>
        </article>
      ))}
    </div>
  </section>
);

export default Testimonials;
