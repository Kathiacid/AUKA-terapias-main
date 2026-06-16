import React from 'react';
import { Link } from 'react-router-dom';
import logoSrc from '../assets/profileauka.jpg'; 
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main-content">
        
        {/* Columna 1: Logo */}
        <div className="footer-column logo-column">
            <div className="footer-logo">
                <Link to="/">
                  <img 
                    src={logoSrc} 
                    alt="Auka Logo" 
                    onError={(e) => {
                      // Si la imagen falla, la ocultamos y mostramos texto para no romper el diseño
                      e.target.style.display = 'none';
                      e.target.parentNode.innerText = '🍃 AUKA'; 
                      e.target.parentNode.style.fontSize = '2rem';
                      e.target.parentNode.style.fontWeight = 'bold';
                      e.target.parentNode.style.color = '#5a8a66';
                    }}
                  />
                </Link>
            </div>
        </div>

        {/* Columna 2: Información */}
        <div className="footer-column links-column">
            <h3>INFORMACIÓN AL CLIENTE</h3>
            <ul>
                <li>
                    <i className="fas fa-circle icon-bullet"></i> 
                    <Link to="/entregas">Entregas</Link>
                </li>
                <li>
                    <i className="fas fa-circle icon-bullet"></i> 
                    <Link to="/glosario">Glosario</Link>
                </li>
                <li>
                    <i className="fas fa-circle icon-bullet"></i> 
                    <Link to="/faq">Preguntas Frecuentes</Link>
                </li>
                <li>
                    <i className="fas fa-circle icon-bullet"></i> 
                    <Link to="/terminos">Términos y Condiciones</Link>
                </li>
            </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="footer-column contact-column">
            <h3>CONTÁCTENOS</h3>
            <div className="contact-item">
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <p>Concepción <br/> Chile</p>
            </div>
            <div className="contact-item">
                <i className="fas fa-phone contact-icon"></i>
                <p>+569 875 635</p>
            </div>
            <div className="contact-item">
                <i className="fas fa-envelope contact-icon"></i>
                <p>aukaterapias@gmail.com</p>
            </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
          <p>AUKATERAPIAS © 2025 | TODOS LOS DERECHOS RESERVADOS | DESARROLLADO POR KAAL</p>
      </div>
    </footer>
  );
};

export default Footer;