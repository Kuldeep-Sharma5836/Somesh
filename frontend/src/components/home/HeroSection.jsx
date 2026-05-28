import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-maroon to-ember px-6 py-14 text-white shadow-soft sm:px-10">
    <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />
    <div className="absolute -bottom-16 left-10 h-52 w-52 rounded-full bg-saffron/20 blur-3xl" />

    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-xs uppercase tracking-[0.22em] text-gold">Premium Spiritual Collection</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
        Invite divine calm into your home with handpicked worship essentials.
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
        Explore statues, malas, diyas, incense, brass pooja sets, and festive collections crafted for
        devotion and design.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/products" className="btn-primary bg-gold text-maroon hover:bg-beige">
          Shop Now
        </Link>
        <a href="#festival" className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white hover:text-maroon">
          Festival Collection
        </a>
      </div>
      <div className="mt-3 flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em] text-white/70">
        <span>Primary: Shop all products</span>
        <span>Secondary: Jump to festival picks</span>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
