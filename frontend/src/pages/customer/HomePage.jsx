import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import HeroSection from '../../components/home/HeroSection';
import CategoryStrip from '../../components/home/CategoryStrip';
import FeaturedGrid from '../../components/home/FeaturedGrid';
import FestivalSpotlight from '../../components/home/FestivalSpotlight';
import Testimonials from '../../components/home/Testimonials';
import Spinner from '../../components/common/Spinner';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catRes, featureRes, productsRes] = await Promise.all([
          axiosClient.get('/categories'),
          axiosClient.get('/products/featured/list'),
          axiosClient.get('/products'),
        ]);

        setCategories(catRes.data);
        setFeaturedProducts(featureRes.data);
        setAllProducts(productsRes.data);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <Spinner label="Loading DivineAura collection..." />;

  return (
    <div>
      <HeroSection />
      <CategoryStrip categories={categories} />
      <FeaturedGrid products={featuredProducts} />
      <FestivalSpotlight
        products={allProducts.filter((p) => p.category?.slug === 'festival-collections')}
      />
      <Testimonials />
    </div>
  );
};

export default HomePage;
