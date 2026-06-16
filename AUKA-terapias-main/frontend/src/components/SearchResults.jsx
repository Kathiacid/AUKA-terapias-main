import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi } from '../api';
import { useCart } from '../components/CartContext'; 
// IMPORTANTE: Importamos Medicinal.css para que las tarjetas se vean IDÉNTICAS

import './SearchResults.css'; // Para estilos exclusivos del encabezado de búsqueda

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ""; 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Traemos cartItems para saber si el producto ya está en el carro
  const { addToCart, cartItems } = useCart(); 

  // 1. Cargar productos
  useEffect(() => {
    productApi.getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2. Filtrado (Nombre + Beneficios + Tipo)
  useEffect(() => {
    if (products.length > 0 && query) {
      const term = query.toLowerCase();

      const results = products.filter(prod => {
        // Normalizamos datos para buscar
        const nombre = (prod.nombre || prod.nombre_prod || "").toLowerCase();
        const beneficios = (prod.beneficios || prod.beneficio_prod || "").toLowerCase();
        const tipo = (prod.tipo || "").toLowerCase();

        return nombre.includes(term) || beneficios.includes(term) || tipo.includes(term);
      });

      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  if (loading) {
    return <div className="loading-container" style={{textAlign:'center', padding:'50px'}}>Buscando en el catálogo... 🍃</div>;
  }

  return (
    // Usamos la clase principal 'catalogo-medicinal' para heredar márgenes y fuentes
    <main className="catalogo-medicinal">
      
      {/* Encabezado simple para los resultados */}
      <div className="search-header-container">
        <h1>Resultados para: <span style={{color: '#4CA54C'}}>"{query}"</span></h1>
        <p>{filteredProducts.length} productos encontrados</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', backgroundColor: '#f4f4e8', borderRadius: '15px', border: '1px dashed #d4d4c0'}}>
          <h3 style={{color: '#333'}}>No encontramos coincidencias</h3>
          <p style={{color: '#666'}}>Intenta buscar por ingrediente (ej. "Matico") o beneficio (ej. "Dolor").</p>
          <Link to="/" style={{color: '#4CA54C', fontWeight: 'bold', marginTop: '10px', display: 'inline-block'}}>
            Volver al inicio
          </Link>
        </div>
      ) : (
        // Usamos TU grid original
        <div className="product-grid-medicinal">
          {filteredProducts.map((producto) => {
             // 1. Verificamos si está en el carrito
             const yaEnCarrito = cartItems.some(item => item.id === producto.id);

             // 2. Normalización de datos (La API de búsqueda o getProducts podría devolver nombres distintos a getByCategory)
             const nombre = producto.nombre_prod || producto.nombre;
             const imagen = producto.img_prod || producto.imagen;
             const beneficio = producto.beneficio_prod || producto.beneficios;
             const tipo = producto.tipo_descripcion || producto.tipo;
             const precio = Number(producto.precio_prod || producto.precio);
             const precioActual = Number(producto.precio_actual);
             // Asumimos stock 1 si no viene definido para evitar errores visuales
             const stock = producto.stock !== undefined ? producto.stock : 1; 

             return (
                <div className="product-card" key={producto.id}>
                  
                  {/* --- IMAGEN Y BADGES --- */}
                  <div className="card-image-container">
                    {!stock ? (
                      <span className="badge agotado" style={{backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                        Agotado
                      </span>
                    ) : producto.tiene_descuento ? (
                      <span className="badge oferta" style={{backgroundColor: '#d9822b', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                        OFERTA
                      </span>
                    ) : null}

                    <img 
                      src={imagen} 
                      alt={nombre} 
                      className="card-image-fit" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/300?text=Auka'; 
                      }}
                    />
                  </div>

                  {/* --- CUERPO DE LA TARJETA --- */}
                  <div className="card-body">
                    <h3>
                        <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {nombre}
                        </Link>
                    </h3>
                    
                    {/* Tipo / Descripción */}
                    {tipo && (
                        <span style={{fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px'}}>
                        {tipo}
                        </span>
                    )}

                    {/* Beneficios */}
                    <p className="beneficios" style={{ fontSize: '0.9em', color: '#666', margin: '5px 0' }}>
                        {beneficio}
                    </p>

                    {/* Precio */}
                    <p className="price">
                      {producto.tiene_descuento ? (
                        <>
                          <span className="precio-antiguo" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em', marginRight: '10px' }}>
                            ${precio.toLocaleString('es-CL')}
                          </span>
                          <span className="precio-nuevo" style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2em' }}>
                            ${precioActual.toLocaleString('es-CL')}
                          </span>
                        </>
                      ) : (
                        <span className="precio-normal" style={{ color: '#4CA54C', fontWeight: 'bold', fontSize: '1.2em' }}>
                          ${precio.toLocaleString('es-CL')}
                        </span>
                      )}
                    </p>

                    {/* Botón de Agregar */}
                    <button 
                      className={`add-to-cart-btn ${yaEnCarrito ? 'btn-deshabilitado' : ''}`} 
                      disabled={!stock || yaEnCarrito} 
                      style={{ opacity: (!stock || yaEnCarrito) ? 0.6 : 1 }}
                      onClick={() => addToCart(producto, 1)}
                    >
                      {!stock ? (
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
          })}
        </div>
      )}
    </main>
  );
}