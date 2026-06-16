import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api'; 
import './DetalleProducto.css';
import { useCart } from '../components/CartContext';

const DetalleProducto = () => {
  const { id } = useParams(); 
  const { addToCart, cartItems } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState('');
  
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        const data = await productApi.getById(id);
        setProducto(data);
        if (data && data.img_prod) {
          setImagenActiva(data.img_prod);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("No pudimos cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  const handleCantidad = (tipo) => {
    if (tipo === 'menos' && cantidad > 1) setCantidad(cantidad - 1);
    if (tipo === 'mas') setCantidad(cantidad + 1);
  };

  const handleAgregarCarrito = () => {
    if (!producto) return;
    addToCart(producto, cantidad);
  };

  if (loading) return <div className="loading-msg">Cargando detalles...</div>;
  if (error || !producto) return <div className="loading-msg">{error || "Producto no encontrado"}</div>;

  const yaEnCarrito = cartItems.some(item => item.id === producto.id);

  const listaBeneficios = producto.beneficio_prod && producto.beneficio_prod.includes(',') 
      ? producto.beneficio_prod.split(',').map(b => b.trim())
      : [producto.beneficio_prod];
      
  const categoriaTexto = producto.categorias && producto.categorias.length > 0 
      ? producto.categorias.map(c => c.nombre_cat).join(' / ')
      : producto.tipo;

  let rutaCategoria = "/";       
  let nombreCategoria = "Productos"; 
  const infoParaRuta = (categoriaTexto + " " + (producto.tipo || "")).toLowerCase();

  if (infoParaRuta.includes('medicinal')) {
      rutaCategoria = "/medicinal";
      nombreCategoria = "Medicinal";
  } else if (infoParaRuta.includes('cosmetica') || infoParaRuta.includes('cosmética')) {
      rutaCategoria = "/cosmetica";
      nombreCategoria = "Cosmética";
  }

  return (
    <div className="detalle-wrapper">
      <nav className="breadcrumbs">
        <Link to="/">Inicio</Link> / <Link to={rutaCategoria}>{nombreCategoria}</Link> / <span className="current">{producto.nombre_prod}</span>
      </nav>

      <div className="detalle-grid">
        <div className="gallery-section">
            <div className="main-image-container">
            <span className="badge-nuevo">{producto.tipo}</span>
            {!producto.stock && <span className="badge-agotado">Agotado</span>}
            <img 
                src={imagenActiva || producto.img_prod} 
                alt={producto.nombre_prod} 
                className="main-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Sin+Imagen'; }}
            />
            </div>
        </div>

        <div className="info-section">
          <h1 className="product-title">{producto.nombre_prod}</h1>
          <p className="product-subtitle">{categoriaTexto}</p>
          
          <div className="product-price">
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
          </div>

          <div className="product-description">
            <p>{producto.descripcion_prod}</p>
          </div>

          <div className="actions-container">
            {producto.stock && (
              <div className="quantity-control">
                <button onClick={() => handleCantidad('menos')} disabled={yaEnCarrito}>&minus;</button>
                <span>{cantidad}</span>
                <button onClick={() => handleCantidad('mas')} disabled={yaEnCarrito}>+</button>
              </div>
            )}

            <button 
              className={`btn-add-cart ${yaEnCarrito ? 'btn-agregado' : ''}`} 
              disabled={!producto.stock || yaEnCarrito} 
              onClick={handleAgregarCarrito}
            >
              {producto.stock ? (
                yaEnCarrito ? (
                    <> <i className="fas fa-check"></i> En tu Carrito </>
                ) : (
                    <> <i className="fas fa-shopping-cart"></i> Agregar al Carrito </>
                )
              ) : (
                'Sin Stock'
              )}
            </button>
          </div>

          <hr className="divider" />
          
          {listaBeneficios.length > 0 && listaBeneficios[0] && (
            <div className="benefits-section">
              <h3>Beneficios Clave:</h3>
              <ul>
                {listaBeneficios.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="detalle-bottom-description">
        <h3>Descripción Detallada</h3>
        <div className="desc-content">
            <p>{producto.descripcion_prod}</p>
        </div>
      </div>

    </div>
  );
};

export default DetalleProducto;