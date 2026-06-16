import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api'; 
import './Cosmetica.css'; 
import { useCart } from '../components/CartContext';

export default function Cosmetica() {
  const { addToCart, cartItems } = useCart(); 

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('Todo');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  useEffect(() => {
    const fetchCosmetica = async () => {
      try {
        setLoading(true);
        const data = await productApi.getByCategory('cosmetica');
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCosmetica();
  }, []);

  const productosFiltrados = filtroActivo === 'Todo' 
    ? productos 
    : productos.filter(p => {
        const tipoProducto = p.tipo ? p.tipo.toLowerCase() : '';
        const filtro = filtroActivo.toLowerCase();
        return tipoProducto === filtro;
      });

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosVisibles = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const handleFiltroClick = (filtro) => {
    setFiltroActivo(filtro);
    setPaginaActual(1);
  };
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <div className="catalogo-cosmetica">
      <div className='banner-container'>
        <div className="banner-content">
            <img 
              src='https://sinsinsin-ecotienda.com/wp-content/uploads/2023/07/banner-cosmetica-natural-Tienda-NaturaLi.jpg' 
              alt="Banner Cosmetica" 
              className="banner-cosmetica"
            />
        </div>
      </div>

      <nav className="cosmetica-filter-bar">
        {['Todo', 'Spray', 'Roll-on', 'Serum', 'Barra', 'Ungüento'].map(filtro => (
          <button 
            key={filtro}
            onClick={() => handleFiltroClick(filtro)} 
            className={filtroActivo === filtro ? 'active' : ''}
          >
            {filtro}
          </button>
        ))}
      </nav>
      
      <div className="cosmetica-grid">
        {productosVisibles.length > 0 ? (
          productosVisibles.map((producto) => {

            const yaEnCarrito = cartItems.some(item => item.id === producto.id);

            return (
                <div className="cosmetica-card" key={producto.id}>
                  
                  {producto.stock === false && <div className="cosmetica-offer-tag" style={{background:'red'}}>AGOTADO</div>}

                  <div className="cosmetica-image-container">
                      <img 
                        src={producto.img_prod} 
                        alt={producto.nombre_prod} 
                        className="cosmetica-image"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; 
                        }} 
                      />
                  </div>

                  <div className="cosmetica-info">
                      <h3 className="cosmetica-name">
                        <Link to={`/producto/${producto.id}`}>
                            {producto.nombre_prod}
                        </Link>
                      </h3>

                      <span style={{fontSize: '0.75rem', textTransform: 'uppercase', color: '#999', letterSpacing: '1px', display: 'block', marginBottom: '5px'}}>
                        {producto.tipo_descripcion || producto.tipo}
                      </span>

                      <div className="cosmetica-beneficios-container">
                        <p className="cosmetica-beneficios">
                            <i className="fa-solid fa-sparkles"></i> {producto.beneficio_prod}
                        </p>
                      </div>

                      <div className="cosmetica-prices">
                        <p className="cosmetica-price">
                          ${Number(producto.precio_prod).toLocaleString('es-CL')}
                        </p>
                      </div>
                  <button 
                        className={`add-to-cart-btn ${yaEnCarrito ? 'btn-deshabilitado' : ''}`} 
                        disabled={!producto.stock || yaEnCarrito} 
                        style={{ opacity: (!producto.stock || yaEnCarrito) ? 0.6 : 1 }}
                        onClick={() => addToCart(producto, 1)}
                      >
                        <i className={yaEnCarrito ? "fas fa-check" : "fa-solid fa-cart-shopping"}></i> 
                        
                        {!producto.stock 
                          ? ' Sin Stock' 
                          : yaEnCarrito 
                              ? ' Agregado'
                              : ' Agregar al carrito'}
                      </button>
                  </div>
                </div>
            );
          })
        ) : (
          <div className="no-products" style={{width: '100%', textAlign: 'center', padding: '40px'}}>
            <h3>No hay productos de tipo "{filtroActivo}" disponibles.</h3>
          </div>
        )}
      </div>

      {productosFiltrados.length > productosPorPagina && (
        <div className="pagination-container">
            <button 
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
                className="pagination-btn"
            >
                Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => cambiarPagina(index + 1)}
                    className={`pagination-number ${paginaActual === index + 1 ? 'active' : ''}`}
                >
                    {index + 1}
                </button>
            ))}

            <button 
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className="pagination-btn"
            >
                Siguiente
            </button>
        </div>
        )}

    </div>
    );
}