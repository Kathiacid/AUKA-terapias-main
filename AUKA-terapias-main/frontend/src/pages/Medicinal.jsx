import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api'; 
import './Medicinal.css'; 
import { useCart } from '../components/CartContext';

export default function Medicinal() {
  const { addToCart, cartItems } = useCart(); 

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('Todo');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  useEffect(() => {
    const fetchMedicinal = async () => {
      try {
        setLoading(true);
        const data = await productApi.getByCategory('medicinal');
        setProductos(data);
      } catch (error) {
        console.error("Error cargando medicinales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicinal();
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

  if (loading) return <div className="loading-container" style={{textAlign:'center', padding:'50px'}}>Cargando herbolaria...</div>;

  return (
    <div>
      <main className="catalogo-medicinal">
        <div className="banner-container">
          <div className="banner-content">
            <img 
              src='https://healthhispanica.com/cdn/shop/collections/Single-Herb-Supplements-Banner_1200x400.jpg?v=1680946473' 
              className='banner-medicinal'
              alt='Banner Medicinal'
            />
          </div>
        </div>

        <nav className="filter-bar">
          <ul>
            {['Todo', 'Spray', 'Roll-on', 'Serum', 'Barra', 'Ungüento'].map((filtro) => (
              <li key={filtro}>
                <button 
                  onClick={() => handleFiltroClick(filtro)} 
                  className={filtroActivo === filtro ? 'active' : ''}
                >
                  {filtro}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="product-grid-medicinal">
          {productosVisibles.length > 0 ? (
            productosVisibles.map((producto) => {
              const yaEnCarrito = cartItems.some(item => item.id === producto.id);

              return (
                <div className="product-card" key={producto.id}>
                  
                  <div className="card-image-container">
                    
                    {!producto.stock ? (
                      <span className="badge agotado" style={{backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                        Agotado
                      </span>
                    ) : producto.tiene_descuento ? (
                      <span className="badge oferta" style={{backgroundColor: '#d9822b', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                        OFERTA
                      </span>
                    ) : null}

                    <img 
                      src={producto.img_prod} 
                      alt={producto.nombre_prod} 
                      className="card-image-fit" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; 
                      }}
                    />
                  </div>

                  <div className="card-body">
                    <h3>
                        <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {producto.nombre_prod}
                        </Link>
                    </h3>
                    
                    <span style={{fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px'}}>
                      {producto.tipo_descripcion || producto.tipo}
                    </span>

                    <p className="beneficios" style={{ fontSize: '0.9em', color: '#666', margin: '5px 0' }}>
                        {producto.beneficio_prod}
                    </p>

                    <p className="price">
                      {producto.tiene_descuento ? (
                        <>
                          <span className="precio-antiguo" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em', marginRight: '10px' }}>
                            ${Number(producto.precio_prod).toLocaleString('es-CL')}
                          </span>
                          <span className="precio-nuevo" style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2em' }}>
                            ${Number(producto.precio_actual).toLocaleString('es-CL')}
                          </span>
                        </>
                      ) : (
                        <span className="precio-normal" style={{ color: '#4CA54C', fontWeight: 'bold', fontSize: '1.2em' }}>
                          ${Number(producto.precio_prod).toLocaleString('es-CL')}
                        </span>
                      )}
                    </p>

                    <button 
                      className={`add-to-cart-btn ${yaEnCarrito ? 'btn-deshabilitado' : ''}`} 
                      disabled={!producto.stock || yaEnCarrito} 
                      style={{ opacity: (!producto.stock || yaEnCarrito) ? 0.6 : 1 }}
                      onClick={() => addToCart(producto, 1)}
                    >
                      {!producto.stock ? (
                          'Sin Stock'
                      ) : yaEnCarrito ? (
                          <><i className="fas fa-check"></i> En el carrito</>
                      ) : (
                          <><i className="fa-solid fa-cart-shopping"></i> Agregar</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{width: '100%', textAlign: 'center', padding: '40px', color: '#666'}}>
                <h3>No hay productos de tipo {filtroActivo} en esta categoría.</h3>
              <button 
                onClick={() => setFiltroActivo('Todo')} 
                style={{marginTop: '10px', cursor: 'pointer', color: '#5a8a66', background:'none', border:'none', textDecoration:'underline'}}
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>

        {productosFiltrados.length > productosPorPagina && (
            <div className="pagination-container">
                <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="pagination-btn"> <i className="fas fa-chevron-left"></i> Anterior </button>
                {Array.from({ length: totalPaginas }, (_, index) => (
                    <button key={index + 1} onClick={() => cambiarPagina(index + 1)} className={`pagination-number ${paginaActual === index + 1 ? 'active' : ''}`}> {index + 1} </button>
                ))}
                <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="pagination-btn"> Siguiente <i className="fas fa-chevron-right"></i> </button>
            </div>
        )}
      </main>
    </div>
  );
}