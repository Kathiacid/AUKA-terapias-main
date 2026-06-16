import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import Blog from './pages/Blog.jsx';
import Medicinal from './pages/Medicinal.jsx';
import SobreNosotros from './pages/SobreNosotros.jsx';
import Cosmetica from './pages/Cosmetica.jsx'; 
import ProductoDetalle from './pages/DetalleProducto.jsx'; 
import Servicios from './pages/Servicios.jsx';
import Navbar from './components/Navbar.jsx'; 
import Footer from './components/Footer.jsx'; 
import Busqueda from './pages/Busqueda.jsx';
import NotFound from './pages/NotFound.jsx';
import CategoriaPlantilla from './pages/CategoriaPlantilla.jsx'; // <--- IMPORTACIÓN NUEVA
import { CartProvider } from './components/CartContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx'
import SearchResults from './components/SearchResults.jsx';

function App() {
  return (
    <CartProvider>
    <BrowserRouter>
    <ScrollToTop />
    <Navbar/>
      <main>
        <Routes>
          {/* Rutas Fijas (Prioridad Alta) */}
          <Route path="/busqueda" element={<SearchResults />} />
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/medicinal" element={<Medicinal />} />
          <Route path="/cosmetica" element={<Cosmetica />} />
          <Route path="/sobrenosotros" element={<SobreNosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} /> 
          <Route path="/busqueda" element={<Busqueda />}/>
          <Route path="/:slug" element={<CategoriaPlantilla />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
      <Footer /> 
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;