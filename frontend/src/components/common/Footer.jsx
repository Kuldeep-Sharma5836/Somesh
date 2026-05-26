const Footer = () => (
  <footer className="mt-14 border-t border-gold/20 bg-white/80">
    <div className="container-pad grid gap-8 py-10 md:grid-cols-3">
      <div>
        <h3 className="font-display text-2xl font-semibold text-maroon">Dhruv Global Trading Company</h3>
        <p className="mt-2 text-sm text-maroon/75">
          Bringing devotion into modern living with premium spiritual and worship essentials.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-maroon/70">Contact</h4>
        <p className="mt-2 text-sm text-maroon/80">support@dhruvglobaltradingcompany.com</p>
        <p className="text-sm text-maroon/80">+91 90000 11223</p>
        <p className="text-sm text-maroon/80">Varanasi, India</p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-maroon/70">Social</h4>
        <div className="mt-2 flex gap-3 text-sm text-maroon/80">
          <a href="#" className="hover:text-saffron">
            Instagram
          </a>
          <a href="#" className="hover:text-saffron">
            YouTube
          </a>
          <a href="#" className="hover:text-saffron">
            Facebook
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
