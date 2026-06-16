import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api'; 
import { useCart } from '../components/CartContext'; 
import './ProductCarrusel.css';

const ProductCarousel = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { addToCart, cartItems } = useCart(); 

    useEffect(() => {
        const fetchDestacados = async () => {
            try {
                const data = await productApi.getFeatured();
                const listaRaw = Array.isArray(data) ? data : (data.results || []);

                const productosAdaptados = listaRaw.map(item => {
                    const p = item.producto || item; 
                    const precioOriginal = parseFloat(p.precio_prod);
                    const precioFinal = p.precio_actual ? parseFloat(p.precio_actual) : precioOriginal;
                    const esOferta = precioFinal < precioOriginal;

                    return {
                        id: p.id,
                        nombre: p.nombre_prod || "Producto sin nombre",
                        imagen: p.img_prod || "https://via.placeholder.com/300?text=Sin+Imagen",
                        // Mapeamos el beneficio y el tipo para que coincida con la tarjeta Medicinal
                        descripcion: p.beneficio_prod || p.descripcion_prod || "Sin descripción",
                        tipo: p.tipo_descripcion || p.tipo || "Producto", 
                        precio: precioFinal,
                        old_price: esOferta ? precioOriginal : null,
                        stock: p.stock ?? true,
                        offer: esOferta
                    };
                });

                setProducts(productosAdaptados.filter(p => p.id));
            } catch (error) {
                console.error("Error cargando destacados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestacados();
    }, []);

    if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Cargando destacados...</div>;
    if (products.length === 0) return null;

    return (
        <div className="product-carousel-container">
            <div className="carousel-header">
                <h2>Productos Destacados 🍃</h2>
                <h3 className="subtitle">Nuestras mejores selecciones y ofertas exclusivas de la semana.</h3>
            </div>

            <div className="product-carousel">
                <div className="product-carousel-inner">
                    {products.map(product => {
                        const yaEnCarrito = cartItems.some(item => item.id === product.id);

                        return (
                            <div key={product.id} className="product-card">
                                
                                {/* --- BADGES (IGUAL QUE MEDICINAL) --- */}
                                <div className="card-image-container">
                                    {!product.stock ? (
                                        <span className="badge agotado" style={{backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                                            Agotado
                                        </span>
                                    ) : product.offer ? (
                                        <span className="badge oferta" style={{backgroundColor: '#d9822b', color: 'white', padding: '5px 10px', borderRadius: '5px', position: 'absolute', top: '10px', right: '10px', zIndex: 10, fontSize: '0.8rem'}}>
                                            OFERTA
                                        </span>
                                    ) : null}

                                    <img
                                        src={product.imagen}
                                        alt={product.nombre}
                                        className="card-image-fit"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen';
                                        }}
                                    />
                                </div>

                                <div className="card-body">
                                    <h3>
                                        <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {product.nombre}
                                        </Link>
                                    </h3>
                                    
                                    <span style={{fontSize: '0.8rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px'}}>
                                        {product.tipo}
                                    </span>

                                    <p className="beneficios" style={{ fontSize: '0.9em', color: '#666', margin: '5px 0' }}>
                                        {product.descripcion}
                                    </p>

                                    <p className="price">
                                        {product.offer ? (
                                            <>
                                                <span className="precio-antiguo" style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em', marginRight: '10px' }}>
                                                    ${Number(product.old_price).toLocaleString('es-CL')}
                                                </span>
                                                <span className="precio-nuevo" style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.2em' }}>
                                                    ${Number(product.precio).toLocaleString('es-CL')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="precio-normal" style={{ color: '#4CA54C', fontWeight: 'bold', fontSize: '1.2em' }}>
                                                ${Number(product.precio).toLocaleString('es-CL')}
                                            </span>
                                        )}
                                    </p>

                                    <button 
                                        className={`add-to-cart-btn ${yaEnCarrito ? 'btn-deshabilitado' : ''}`}
                                        disabled={!product.stock || yaEnCarrito}
                                        style={{ opacity: (!product.stock || yaEnCarrito) ? 0.6 : 1 }}
                                        onClick={() => addToCart({
                                            id: product.id,
                                            nombre_prod: product.nombre,
                                            img_prod: product.imagen,
                                            precio_prod: product.precio,
                                            stock: product.stock,
                                            tipo: 'Destacado'
                                        })}
                                    >
                                        {!product.stock ? (
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
            </div>
        </div>
    );
};

export default ProductCarousel;