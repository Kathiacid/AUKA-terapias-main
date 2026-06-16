import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext'; 
import { productApi } from '../api'; 
import './Navbar.css';

export default function Navbar() {
  const { cartItems, removeFromCart, cartTotal, totalAhorro, clearCart } = useCart(); 
  
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoriasExtras, setCategoriasExtras] = useState([]);
  
  // --- ESTADOS PARA BÚSQUEDA ---
  const [allProducts, setAllProducts] = useState([]); // <--- 1. NUEVO ESTADO PARA TODO EL CATÁLOGO
  const [liveResults, setLiveResults] = useState([]); 
  const [showLiveResults, setShowLiveResults] = useState(false); 
  const searchContainerRef = useRef(null); 

  const navigate = useNavigate();

  const linksFijos = ['inicio', 'cosmetica', 'medicinal', 'servicios', 'blog', 'sobrenosotros', 'sobre nosotros'];

  // --- CARGA INICIAL (Categorías y PRODUCTOS) ---
  useEffect(() => {
    // 1. Cargar Categorías
    productApi.getCategories()
      .then(data => {
        const nuevas = data.filter(cat => !linksFijos.includes(cat.nombre.toLowerCase().replace(/\s/g, '')));
        setCategoriasExtras(nuevas);
      })
      .catch(err => console.error("Error cargando categorías:", err));

    // 2. Cargar TODOS los productos para buscar localmente
    // IMPORTANTE: Asegúrate de que 'getProducts' traiga la lista completa
    productApi.getProducts() 
      .then(data => {
        setAllProducts(data); // Guardamos todo en memoria
      })
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  // --- LÓGICA DE BÚSQUEDA EN VIVO (LOCAL) ---
  useEffect(() => {
    // Si no hay productos cargados, no hacemos nada
    if (!allProducts || allProducts.length === 0) return;

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        
        const term = searchTerm.toLowerCase();

        // --- AQUI ESTA LA MAGIA DEL FILTRO ---
        // Filtramos sobre la lista 'allProducts' que ya tenemos en memoria
        const resultadosFiltrados = allProducts.filter(prod => {
            // Validamos que los campos existan antes de usar toLowerCase()
            const nombre = prod.nombre ? prod.nombre.toLowerCase() : "";
            const beneficios = prod.beneficios ? prod.beneficios.toLowerCase() : "";
            
            // .includes() busca coincidencia parcial (letra por letra)
            const nombreMatch = nombre.includes(term);
            const beneficiosMatch = beneficios.includes(term);
            
            // Retorna verdadero si encuentra coincidencia en cualquiera de los dos
            return nombreMatch || beneficiosMatch;
        });

        setLiveResults(resultadosFiltrados.slice(0, 5)); // Mostramos solo los primeros 5
        setShowLiveResults(true);

      } else {
        setLiveResults([]);
        setShowLiveResults(false);
      }
    }, 300); // Pequeña espera para no saturar al escribir

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, allProducts]); // Se ejecuta cuando cambia el término o se cargan los productos

  // Cerrar la lista si haces clic fuera del buscador
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowLiveResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navegar al producto seleccionado
  const handleSelectProduct = (id) => {
      navigate(`/producto/${id}`);
      setSearchTerm("");
      setShowLiveResults(false);
      setIsCartOpen(false);
  };
  // ------------------------------------

  const handleConsultarStock = () => {
    const hora = new Date().getHours();
    const saludo = hora >= 6 && hora < 20 ? "Buenos días ☀️" : "Buenas noches 🌙";
  
    const listaProductos = cartItems.map(item => {
        const cantidadStr = item.cantidad > 1 ? ` (x${item.cantidad})` : '';
        let precioTexto = "";
        let precioUnitario = 0;

        if (item.tiene_descuento && item.precio_actual) {
            precioUnitario = Number(item.precio_actual);
            precioTexto = `$${precioUnitario.toLocaleString('es-CL', { maximumFractionDigits: 0 })} (Oferta 🔥)`;
        } else {
            precioUnitario = Number(item.precio_prod);
            precioTexto = `$${precioUnitario.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
        }
        const subtotal = precioUnitario * item.cantidad;
        return `🌱 *${item.nombre_prod}*${cantidadStr}\n   Valor un.: ${precioTexto}\n   Subtotal: $${subtotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
    }).join('\n\n');

    let resumenEconomico = `💰 *Total a pagar:* $${cartTotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
    
    if (totalAhorro > 0) {
        resumenEconomico += `\n🎉 *¡Ahorro total:* $${totalAhorro.toLocaleString('es-CL', { maximumFractionDigits: 0 })}!*`;
    }

    const mensajeTexto = 
      `${saludo}, espero que se encuentre muy bien.\n\n` +
      `Le escribo para consultar disponibilidad de mi pedido en *AUKA*:\n\n` +
      `${listaProductos}\n\n` +
      `----------------------------\n` +
      `${resumenEconomico}\n\n` +
      `Quedo atento a su confirmación. ¡Gracias! 🍃`;

    const numeroTelefono = "+56954714573"; 
    const mensajeCodificado = encodeURIComponent(mensajeTexto);
    const url = `https://api.whatsapp.com/send?phone=${numeroTelefono}&text=${mensajeCodificado}`;
    
    window.open(url, '_blank');
    setIsCartOpen(false);
    setShowConfirmModal(true);
  };

  const confirmarEnvio = () => {
    clearCart();
    setShowConfirmModal(false);
  };

  const cancelarConfirmacion = () => {
    setShowConfirmModal(false);
  };

  const handleSearch = (e) => {
    if ((e.type === 'keydown' && e.key === 'Enter') || e.type === 'click') {
        if (searchTerm.trim() !== "") {
            navigate(`/busqueda?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm(""); 
            setIsCartOpen(false); 
            setShowLiveResults(false);
        }
    }
  };

  const cantidadTotalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">🍃 <h2>AUKA</h2></Link>
      </div>

      <nav className="navbar-links">
        <ul>
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/cosmetica">Cosmetica</NavLink></li>          
          <li><NavLink to="/medicinal">Medicinal</NavLink></li>
          
          {/* --- MENÚ DESPLEGABLE DINÁMICO --- */}
          {categoriasExtras.length > 0 && (
            <li className="nav-item-dropdown">
              <span className="nav-link-span">
                Otras <i className="fas fa-chevron-down" style={{fontSize:'0.8em', marginLeft:'5px'}}></i>
              </span>
              <ul className="dropdown-menu">
                {categoriasExtras.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/${cat.slug || cat.nombre.toLowerCase().replace(/\s+/g, '-')}`}>
                      {cat.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
          {/* ---------------------------------- */}
          <li><NavLink to="/servicios">Servicios</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/sobrenosotros">Sobre Nosotros</NavLink></li>
        </ul>
      </nav>

      <div className="navbar-right">
        {/* BUSCADOR CON RESULTADOS EN VIVO */}
        <div className="navbar-search" ref={searchContainerRef}>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => { if(liveResults.length > 0) setShowLiveResults(true); }}
          />
          <i className="fas fa-search" onClick={handleSearch} style={{cursor: 'pointer'}}></i>

          {/* LISTA DESPLEGABLE DE RESULTADOS */}
          {showLiveResults && liveResults.length > 0 && (
              <div className="search-live-dropdown">
                  {liveResults.map(prod => (
                      <div 
                        key={prod.id} 
                        className="search-live-item"
                        onClick={() => handleSelectProduct(prod.id)}
                      >
                          <img 
                            src={prod.imagen} 
                            alt="mini" 
                            onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                          />
                          <div className="search-live-info">
                              <span className="search-live-name">{prod.nombre}</span>
                              <span className="search-live-price">
                                  ${Number(prod.precio_actual || prod.precio).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                              </span>
                          </div>
                      </div>
                  ))}
                  <div className="search-live-footer" onClick={handleSearch}>
                      Ver todos los resultados ({liveResults.length}+)
                  </div>
              </div>
          )}
        </div>

        <div className="navbar-cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          <i className="fas fa-shopping-cart"></i>
          {cantidadTotalItems > 0 && <span className="cart-badge">{cantidadTotalItems}</span>}
        </div>

        {isCartOpen && (
          <div className="cart-dropdown">
            <h4>Tu selección de consulta</h4>
            {cartItems.length === 0 ? (
              <p>No has seleccionado nada aún.</p>
            ) : (
              <>
                <ul className="cart-items-list">
                  {cartItems.map((item, index) => {
                    return (
                        <li key={index} className="cart-item">
                        <img 
                            src={item.img_prod} 
                            alt="mini" 
                            className="cart-thumb" 
                            onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                        />
                        <div className="cart-item-info">
                            <span>
                                {item.nombre_prod} 
                                {item.cantidad > 1 && <strong style={{color: '#28a745'}}> x{item.cantidad}</strong>}
                            </span>
                            
                            <small>
                                {item.tiene_descuento ? (
                                    <>
                                        <span style={{textDecoration:'line-through', color:'#999', marginRight:'5px'}}>
                                            ${Number(item.precio_prod).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                                        </span>
                                        <span style={{color:'#e74c3c', fontWeight:'bold'}}>
                                            ${Number(item.precio_actual).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                                        </span>
                                    </>
                                ) : (
                                    `$${Number(item.precio_prod).toLocaleString('es-CL', { maximumFractionDigits: 0 })}`
                                )}
                            </small>
                        </div>
                        <button onClick={() => removeFromCart(index)} className="btn-remove"><i className="fas fa-trash"></i></button>
                        </li>
                    );
                  })}
                </ul>
                
                <div className="cart-total-preview">
                    <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.1rem'}}>
                        <span>Total:</span>
                        <span>${cartTotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
                    </div>
                    
                    {totalAhorro > 0 && (
                        <div style={{display:'flex', justifyContent:'space-between', color:'#e74c3c', fontSize:'0.9rem', marginTop:'5px'}}>
                            <span>¡Estás ahorrando!</span>
                            <span>-${totalAhorro.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
                        </div>
                    )}
                </div>

                <button className="btn-whatsapp-consultar" onClick={handleConsultarStock}>
                    <i className="fab fa-whatsapp"></i> Ir a Consultar
                </button>
              </>
            )}
          </div>
        )}

        {showConfirmModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>¿Enviaste tu mensaje?</h3>
                    <p>Si ya enviaste el mensaje por WhatsApp, podemos vaciar tu carrito para una nueva compra.</p>
                    <div className="modal-actions">
                        <button onClick={confirmarEnvio} className="btn-confirm">
                            Sí, vaciar carrito
                        </button>
                        <button onClick={cancelarConfirmacion} className="btn-cancel">
                            No, mantener productos
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}