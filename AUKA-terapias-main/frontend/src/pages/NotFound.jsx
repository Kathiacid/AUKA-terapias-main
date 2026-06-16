import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Importamos los estilos específicos

export default function NotFound() {
  return (
    <div className="not-found-container">
      {/* Icono animado de hoja para mantener la identidad de marca */}
      <div className="not-found-icon">
        <i className="fas fa-leaf"></i>
      </div>
      
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">¡Ups! Nos perdimos en la naturaleza</h2>
      
      <p className="not-found-text">
        Lo sentimos, la página que estás buscando no existe, ha sido movida o el enlace es incorrecto. 
        Tal vez quieras volver a nuestra tienda para ver nuestros productos naturales.
      </p>
      
      <Link to="/" className="btn-home">
        <i className="fas fa-home"></i> Volver al Inicio
      </Link>
    </div>
  );
}