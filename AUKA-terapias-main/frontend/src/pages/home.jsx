import React, { useState, useEffect } from 'react'; 
import "./Home.css"; 
import { Link } from 'react-router-dom';
import ProductCarrusel from '../components/ProductCarrusel';
import ReelsCarrusel from '../components/ReelsCarrusel'; 
import { productApi } from '../api'; 

export default function Home() {
    const [mensajes, setMensajes] = useState([]);
    useEffect(() => {
        const fetchMensajes = async () => {
            const data = await productApi.getMarqueeMessages();
            setMensajes(data);
        };
        fetchMensajes();
    }, []);

    const renderMensaje = (msg, index) => {
        if (!msg.enlace) {
            return <span key={index}>{msg.texto}</span>;
        }
        if (msg.enlace.startsWith('/')) {
            return (
                <Link to={msg.enlace} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span>{msg.texto}</span>
                </Link>
            );
        }
        return (
            <a 
                href={msg.enlace} 
                key={index} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <span>{msg.texto}</span>
            </a>
        );
    };

    return (
        <div>
            <div className="ofertas-barra">
                <div className="marquee-content">
                    {mensajes.length > 0 ? (
                        [...mensajes, ...mensajes, ...mensajes].map((msg, index) => renderMensaje(msg, index))
                    ) : (
                        <span>Cargando ofertas... 🍃</span>
                    )}
                </div>
            </div>
            
            <div className="home-hero-section"> 
                <div className="hero-content">
                    <h1>Bienvenido a AUKA terapias</h1>
                    <p>Hierbas medicinales y cosmética natural para tu bienestar.</p>
                    <div className="button-group">
                        <button className="primary-button"><Link to="/cosmetica">Ver Cosmetica</Link></button>
                        <button className="secondary-button"><Link to="/medicinal">Ver Medicinal</Link></button>
                    </div>
                </div>
            </div>

            <section className="home-content">
                <h2>Conoce nuestros productos</h2>
                
                <section className='tarjetas'>
                    <div className='tarjeta-categoria' id="tarjeta1">
                        <i className="fas fa-seedling fa-2x"></i>
                        <h2>Cosmetica</h2>
                        <p>Redescubre tu belleza con el poder de la naturaleza. Nuestra línea cosmética, libre de químicos, utiliza ingredientes puros y orgánicos.</p>
                        <Link to="/cosmetica">Ver más</Link>
                    </div>
                    <div className='tarjeta-categoria' id="tarjeta2">
                        <i className="fas fa-leaf fa-2x"></i>
                        <h2>Medicinal</h2>
                        <p>Conecta con la sabiduría ancestral de la tierra. Nuestra selección medicinal ofrece remedios herbales puros, tinturas e infusiones.</p>
                        <Link to="/medicinal">Ver más</Link>
                    </div>
                    <div className='tarjeta-categoria' id="tarjeta3">
                        <i className="fas fa-users fa-2x"></i>
                        <h2>Servicios</h2>
                        <p>Tu bienestar es integral. Te invitamos a descubrir nuestros servicios terapéuticos, desde masajes descontracturantes hasta sesiones de reiki.</p>
                        <Link to="/servicios">Ver más</Link>
                    </div> 
                </section>
                
            </section>

            <section className='section2'>
                <h2>Sumergete en el mundo AUKA</h2>
                <div className="section-completa">
                    <div className='blog'>
                    <Link to="/blog">Ver todo</Link>
                    
                    <div className='grid-blog'>
                        <div className='tarjeta-blog'><img src="https://totemg.cl/wp-content/uploads/2020/06/El_precio_de_la_miel_multifloral_a_granel_bajo_un_21_en_la_campana_2018_19_19420_0_1559118695.jpg" alt="Post de blog 1" /><span>Salud</span><h3>Miel</h3><p>Más que un simple endulzante, la miel es un botiquín natural...</p><Link to="/blog">Leer más<i className="fa-solid fa-angles-right"></i></Link></div>
                        <div className='tarjeta-blog'><img src="https://www.thespruce.com/thmb/BW18_nTKsHX5Sd_dm7S_ir88tjk=/4090x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-grow-chamomile-1402627-02-crop-9b5069a36d234b089b4a8d51be686493.jpg" alt="Post de blog 2" /><span>Salud</span><h3>Manzanilla</h3><p>La manzanilla es el sinónimo de calma...</p><Link to="/blog">Leer más<i className="fa-solid fa-angles-right"></i></Link></div>
                        <div className='tarjeta-blog'><img src="https://assets1.farmaciasanpablo.com.mx/landings/_blog/natural/para-que-sirve-el-poleo.jpg" alt="Post de blog 3" /><span>Salud</span><h3>Poleo</h3><p>El poleo es el gran aliado de tu digestión...</p><Link to="/blog">Leer más <i className="fa-solid fa-angles-right"></i></Link></div>
                        <div className='tarjeta-blog'><img src="https://thumbs.dreamstime.com/b/hierbas-para-el-masaje-4014437.jpg?w=992" alt="Post de blog 4" /><span>Salud</span><h3>Masajes</h3><p>Un masaje no es un lujo, es una necesidad...</p><Link to="/blog">Leer más<i className="fa-solid fa-angles-right"></i></Link></div>
                    </div>
                </div>
                <div className='instagram'>
                    <div className="instagram-profile-block">
                        <a 
                            href="https://www.instagram.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="instagram-button"
                        >
                            Síguenos en Instagram
                        </a>
                        <ReelsCarrusel />
                    </div>
                </div>
                </div>
            </section>
                
            <section className='destacados'>
                <div className="carousel-destacados">
                    <ProductCarrusel/>
                </div>
            </section>
        </div>
    );
}