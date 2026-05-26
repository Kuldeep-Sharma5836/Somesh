import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = () => (
  <div className="min-h-screen bg-aura">
    <Navbar />
    <main className="container-pad py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
