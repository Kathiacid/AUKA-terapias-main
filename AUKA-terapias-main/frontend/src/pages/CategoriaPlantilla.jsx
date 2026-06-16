import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api'; 
import { useCart } from '../components/CartContext'; 
import NotFound from './NotFound'; 
import './CategoriaPlantilla.css'; 

export default function CategoriaPlantilla() {
  const { slug } = useParams(); 
  const { addToCart, cartItems } = useCart();
  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [esCategoriaInvalida, setEsCategoriaInvalida] = useState(false);
  
  const [filtroActivo, setFiltroActivo] = useState('Todo');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      setEsCategoriaInvalida(false);

      try {
        // 1. Validar existencia de categoría
        const categorias = await productApi.getCategories();
        const categoriaExiste = categorias.some(cat => cat.slug === slug);

        if (!categoriaExiste) {
          setEsCategoriaInvalida(true);
          setLoading(false);
          return;
        }

        // 2. Cargar datos
        const tituloFormateado = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
        setTitulo(tituloFormateado);

        const data = await productApi.getByCategory(slug);
        setProductos(data);

      } catch (error) {
        console.error("Error cargando datos:", error);
        setProductos([]); 
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [slug]);

  if (esCategoriaInvalida) return <NotFound />;
  if (loading) return <div className="loading-msg">Cargando catálogo...</div>;

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = filtroActivo === 'Todo'
    ? productos
    : productos.filter(p => {
        const tipoProducto = p.tipo ? p.tipo.toLowerCase() : '';
        const filtro = filtroActivo.toLowerCase();
        return tipoProducto === filtro;
      });

  // --- LÓGICA DE PAGINACIÓN ---
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

  return (
    <div className="catalogo-dinamico">
      
      {/* BANNER */}
      <div className="banner-container" style={{marginBottom: '30px', textAlign: 'center'}}>
        <h1>{titulo}</h1>
        {/* Imagen de portada estática o dinámica según prefieras */}
        <img 
           src='https://www.centroterapeuticoalma.cl/wp-content/uploads/2023/05/COsmetica-natural-portada.jpeg' 
           alt={`Portada ${titulo}`}
           className="banner-medicinal" // Usamos la misma clase que Medicinal para heredar estilos
           style={{width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '10px'}}
        />
      </div>

      {/* BARRA DE FILTROS */}
      <nav className="filter-bar" style={{marginBottom: '30px', display: 'flex', justifyContent: 'center'}}>
        <ul style={{display: 'flex', flexWrap: 'wrap', listStyle: 'none', padding: 0, gap: '10px'}}>
          {['Todo', 'Spray', 'Roll-on', 'Serum', 'Barra', 'Ungüento'].map((filtro) => (
            <li key={filtro}>
              <button 
                onClick={() => handleFiltroClick(filtro)} 
                className={filtroActivo === filtro ? 'active' : ''}
                style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #e0e0e0',
                    backgroundColor: filtroActivo === filtro ? '#5a8a66' : '#f7f6f2',
                    color: filtroActivo === filtro ? 'white' : '#555',
                    cursor: 'pointer'
                }}
              >
                {filtro}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* GRILLA DE PRODUCTOS (Estilo Medicinal) */}
      <div className="product-grid-medicinal" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px'}}>
        {productosVisibles.length > 0 ? (
          productosVisibles.map((prod) => {
            const yaEnCarrito = cartItems.some(item => item.id === prod.id);

            return (
                <div key={prod.id} className="product-card">
              
                  {/* IMAGEN Y BADGES */}
                  <div className="card-image-container">
                    {!prod.stock ? (
                        <span className="badge agotado" style={{backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                            Agotado
                        </span>
                    ) : prod.tiene_descuento ? (
                        <span className="badge oferta" style={{backgroundColor: '#d9822b', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                            OFERTA
                        </span>
                    ) : null}

                    <Link to={`/producto/${prod.id}`}>
                        <img 
                            src={prod.img_prod || 'https://via.placeholder.com/150'} 
                            alt={prod.nombre_prod} 
                            className="card-image-fit"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'}
                        />
                    </Link>
                  </div>
              
                  {/* INFORMACIÓN */}
                  <div className="card-body">
                    <h3>
                        <Link to={`/producto/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {prod.nombre_prod}
                        </Link>
                    </h3>
                    
                    <span style={{fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px'}}>
                      {prod.tipo_descripcion || prod.tipo}
                    </span>

                    <p className="beneficios" style={{ fontSize: '0.9em', color: '#666', margin: '5px 0' }}>
                        {prod.beneficio_prod || prod.descripcion_prod}
                    </p>
                    
                    {/* PRECIOS (Formato sin decimales) */}
                    <p className="price">
                      {prod.tiene_descuento ? (
                        <>
                          <span className="precio-antiguo" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em', marginRight: '10px' }}>
                            ${Number(prod.precio_prod).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                          </span>
                          <span className="precio-nuevo" style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2em' }}>
                            ${Number(prod.precio_actual).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                          </span>
                        </>
                      ) : (
                        <span className="precio-normal" style={{ color: '#4CA54C', fontWeight: 'bold', fontSize: '1.2em' }}>
                          ${Number(prod.precio_prod).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                        </span>
                      )}
                    </p>
                    
                    {/* BOTÓN AGREGAR */}
                    <button 
                        className={`add-to-cart-btn ${yaEnCarrito ? 'btn-deshabilitado' : ''}`}
                        disabled={!prod.stock || yaEnCarrito}
                        style={{ opacity: (!prod.stock || yaEnCarrito) ? 0.6 : 1 }}
                        onClick={() => addToCart({
                            id: prod.id,
                            nombre_prod: prod.nombre_prod,
                            precio_prod: prod.precio_prod,
                            precio_actual: prod.precio_actual,
                            tiene_descuento: prod.tiene_descuento,
                            img_prod: prod.img_prod,
                            stock: prod.stock,
                            cantidad: 1
                        })}
                    >
                        {!prod.stock ? (
                            'Sin Stock'
                        ) : yaEnCarrito ? (
                            <><i className="fas fa-check"></i> En el carrito</>
                        ) : (
                            <><i className="fas fa-shopping-cart"></i> Agregar</>
                        )}
                    </button>
                  </div>
                </div>
            );
          })
        ) : (
            <div style={{width: '100%', textAlign: 'center', padding: '40px', color: '#666', gridColumn: '1/-1'}}>
               <h3>No hay productos de tipo "{filtroActivo}" en esta categoría.</h3>
               <button 
                 onClick={() => setFiltroActivo('Todo')} 
                 style={{marginTop: '10px', cursor: 'pointer', color: '#5a8a66', background:'none', border:'none', textDecoration:'underline'}}
               >
                 Ver todos los productos
               </button>
            </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {productosFiltrados.length > productosPorPagina && (
        <div className="pagination-container" style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px'}}>
            <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="pagination-btn"> <i className="fas fa-chevron-left"></i> Anterior </button>
            {Array.from({ length: totalPaginas }, (_, index) => (
                <button 
                    key={index + 1} 
                    onClick={() => cambiarPagina(index + 1)} 
                    className={`pagination-number ${paginaActual === index + 1 ? 'active' : ''}`}
                    style={{
                        backgroundColor: paginaActual === index + 1 ? '#333' : 'white',
                        color: paginaActual === index + 1 ? 'white' : 'black',
                        border: '1px solid #ddd',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px'
                    }}
                > 
                    {index + 1} 
                </button>
            ))}
            <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="pagination-btn"> Siguiente <i className="fas fa-chevron-right"></i> </button>
        </div>
      )}
    </div>
  );
}