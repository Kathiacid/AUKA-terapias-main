import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faWheatAwn, 
  faFlask, 
  faSpa, 
  faMugHot, 
  faBottleDroplet, 
  faBookOpen, 
  faPumpSoap, 
  faGift,
  faLocationDot,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import './SobreNosotros.css'; 

const AboutUs = () => {

  const icons = {
    leaf: faLeaf,             
    harvest: faWheatAwn,      
    flask: faFlask,          
    bulkHerbs: faSpa,        
    teaMix: faMugHot,        
    tincture: faBottleDroplet,
    workshop: faBookOpen,    
    personalCare: faPumpSoap, 
    gift: faGift              
  };

  return (
    <div className="about-us-container">
      <section className="intro-section">
        <div className="intro-content">
          <h1 className="intro-title">¿Quiénes somos AUKA?</h1>
          <p className="intro-text">
            En AUKA, celebramos el poder ancestral de la naturaleza. 
            Somos un puente entre la sabiduría botánica y tu 
            búsqueda de un bienestar genuino, ofreciendo hierbas 
            puras y orgánicas que nutren cuerpo y espíritu.
          </p>
          <p className="intro-text">
            Nuestra misión es simple: conectar a las personas con la 
            tierra a través de productos que son tan honestos y vitales 
            como la naturaleza misma. Cada hierba cuenta una 
            historia de origen, cuidado y respeto.
          </p>
        </div>
        <div className="intro-image-wrapper">
          <img 
            src="./src/assets/1.jpg" 
            alt="Flores y hierbas secas sobre una mesa de madera" 
            className="intro-image" 
          />
        </div>
      </section>

      <section className="how-we-work-section">
        <div className="centered-header-block">
          <h2 className="centered-title">¿Cómo trabaja AUKA?</h2>
          <p className="centered-subtitle">
            Desde la semilla hasta tu taza, seguimos un proceso consciente y respetuoso con la Tierra
            para garantizar la máxima pureza y potencia en cada hierba.
          </p>
        </div>

        <div className="process-cards-grid">
          <div className="process-card">
            <div className="process-icon-circle">
              <FontAwesomeIcon icon={icons.leaf} />
            </div>
            <h3 className="process-card-title">Cultivo Orgánico</h3>
            <p className="process-card-text">
              Colaboramos con agricultores locales que practican métodos de cultivo 
              orgánicos y sostenibles, sin pesticidas ni químicos.
            </p>
          </div>
      
          <div className="process-card">
            <div className="process-icon-circle">
              <FontAwesomeIcon icon={icons.harvest} />
            </div>
            <h3 className="process-card-title">Cosecha Consciente</h3>
            <p className="process-card-text">
              Cada planta es cosechada a mano en su punto óptimo de madurez para 
              preservar sus propiedades medicinales y aromáticas.
            </p>
          </div>
      
          <div className="process-card">
            <div className="process-icon-circle">
              <FontAwesomeIcon icon={icons.flask} />
            </div>
            <h3 className="process-card-title">Secado y Empaque</h3>
            <p className="process-card-text">
              Utilizamos técnicas de secado natural y empacamos cuidadosamente 
              para mantener la frescura e integridad de cada hierba.
            </p>
          </div>
        </div>
      </section>

      <section className="what-we-do-section">
        <div className="centered-header-block">
          <h2 className="centered-title">¿Qué hace AUKA?</h2>
          <p className="centered-subtitle">
            Ofrecemos una selección curada de hierbas naturales para enriquecer tu vida, promoviendo
            el equilibrio y el bienestar integral.
          </p>
        </div>

        <div className="offerings-grid">
          <div className="offering-card">
            <div className="offering-icon-wrapper">
                <FontAwesomeIcon icon={icons.bulkHerbs} />
            </div>
            <div className="offering-content">
              <h3 className="offering-card-title">Hierbas a Granel</h3>
              <p className="offering-card-text">Selección pura para tus infusiones y remedios.</p>
            </div>
          </div>
          <div className="offering-card">
            <div className="offering-icon-wrapper">
                <FontAwesomeIcon icon={icons.teaMix} />
            </div>
            <div className="offering-content">
              <h3 className="offering-card-title">Mezclas de Infusiones</h3>
              <p className="offering-card-text">Combinaciones expertas para cada momento del día.</p>
            </div>
          </div>

          <div className="offering-card">
            <div className="offering-icon-wrapper">
                <FontAwesomeIcon icon={icons.tincture} />
            </div>
            <div className="offering-content">
              <h3 className="offering-card-title">Tinturas y Extractos</h3>
              <p className="offering-card-text">El poder concentrado de las plantas en cada gota.</p>
            </div>
          </div>
          <div className="offering-card">
            <div className="offering-icon-wrapper">
                <FontAwesomeIcon icon={icons.workshop} />
            </div>
            <div className="offering-content">
              <h3 className="offering-card-title">Talleres y Educación</h3>
              <p className="offering-card-text">Compartimos el conocimiento sobre el uso de las hierbas.</p>
            </div>
          </div>

          <div className="offering-card">
            <div className="offering-icon-wrapper">
                <FontAwesomeIcon icon={icons.personalCare} />
            </div>
            <div className="offering-content">
              <h3 className="offering-card-title">Cuidado Personal</h3>
              <p className="offering-card-text">Productos botánicos para nutrir tu piel y cabello.</p>
            </div>
          </div>
          <div className="offering-card">
            <div className="offering-icon-wrapper">
                <FontAwesomeIcon icon={icons.gift} />
            </div>
            <div className="offering-content">
              <h3 className="offering-card-title">Kits de Regalo</h3>
              <p className="offering-card-text">Regala bienestar con nuestras selecciones especiales.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="locations-section">
        <div className="centered-header-block">
          <h2 className="centered-title">¿Dónde encontrarnos?</h2>
          <p className="centered-subtitle">
            Visítanos en nuestras tiendas y sumérgete en el mundo de AUKA. Un espacio para conectar,
            aprender y descubrir el poder de las hierbas.
          </p>
        </div>

        <div className="locations-grid">
          <div className="location-card">
            <img 
              src="./src/assets/2.jpg" 
              alt="Hojas verdes frescas" 
              className="location-image" 
            />
            <div className="location-details">
              <h3 className="location-name">Casa la Escoba</h3>
              
              <div className="location-info-row">
                <span><FontAwesomeIcon icon={faLocationDot} /></span>
                <p>Rozas 974, Concepción</p>
              </div>
              
              <div className="location-info-row">
                <span><FontAwesomeIcon icon={faClock} /></span>
                <p>Lunes a Sábado: 10am - 8pm</p>
              </div>

              <a href="https://www.google.cl/maps/place/Martinez+de+Rosas+-+Juan+Mart%C3%ADnez+de+Rozas+974,+4030284+Concepci%C3%B3n,+B%C3%ADo+B%C3%ADo/data=!4m2!3m1!1s0x9669b5cf26568d6b:0xcc15a6e635af4de3?sa=X&ved=1t:242&ictx=111" target="blank" className="map-link">Ver en mapa</a>
            </div>
          </div>
          <div className="location-card">
            <img 
              src="./src/assets/3.jpg" 
              alt="Flores de lavanda" 
              className="location-image" 
            />
            <div className="location-details">
              <h3 className="location-name">Tienda Prana</h3>
              
              <div className="location-info-row">
                <span><FontAwesomeIcon icon={faLocationDot} /></span>
                <p>Cochrane 791, Concepción.</p>
              </div>
              
              <div className="location-info-row">
                <span><FontAwesomeIcon icon={faClock} /></span>
                <p>Martes a Domingo: 11am - 7pm</p>
              </div>

              <a href="https://www.google.com/maps/place/Cochrane+791,+4030000+Concepci%C3%B3n,+B%C3%ADo+B%C3%ADo/@-36.8288423,-73.0470993,17z/data=!3m1!4b1!4m6!3m5!1s0x9669b5d1510c0de3:0x40ed95855e41d89d!8m2!3d-36.8288423!4d-73.0470993!16s%2Fg%2F11gm_c9gf9?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D" target='blank' className="map-link">Ver en mapa</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;