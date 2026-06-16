import React, { useState } from 'react'; // [NUEVO] Importamos useState
import './Blog.css';

const Blog = () => {

const [selectedPost, setSelectedPost] = useState(null);
const mockPosts = [
{
    id: 1,
    title: "Jengibre y Cúrcuma: El Dúo Antiinflamatorio",
    description: "La naturaleza nos ofrece poderosos aliados para combatir la inflamación. Aprende a combinar el jengibre y la cúrcuma...",
    fullContent: `
    <p>La inflamación crónica es la raíz de muchas enfermedades modernas. Afortunadamente, la naturaleza nos brinda herramientas poderosas para combatirla. El jengibre y la cúrcuma, dos raíces primas de la familia Zingiberaceae, han sido utilizadas durante siglos en la medicina ayurvédica y china.</p>
    <h3>¿Por qué funcionan?</h3>
    <p>La cúrcuma contiene curcumina, un compuesto con efectos antiinflamatorios comparables a algunos medicamentos farmacéuticos, pero sin los efectos secundarios. El jengibre, por su parte, contiene gingerol, que ayuda a reducir el estrés oxidativo y posee potentes propiedades medicinales.</p>
    <h3>Cómo consumirlos juntos</h3>
    <p>La clave para la cúrcuma es consumirla con pimienta negra, que aumenta su absorción hasta en un 2000%. Un té caliente de jengibre fresco, cúrcuma en polvo, una pizca de pimienta y miel es la forma perfecta de empezar el día.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    `,
    image: "https://i0.wp.com/www.canal12misiones.com/wp-content/uploads/2025/05/image-525.png?resize=1089%2C730&ssl=1",
    alt: "Decoración de plantas colgantes"
},
{
    id: 2,
    title: "Beneficios del Té Matcha",
    description: "Descubre por qué esta antigua bebida japonesa se ha convertido en el superalimento favorito de muchos.",
    fullContent: `
    <p>El té matcha no es solo una tendencia pasajera; es una tradición milenaria con beneficios respaldados por la ciencia. A diferencia del té verde regular, donde infusionas las hojas y luego las desechas, con el matcha estás consumiendo la hoja entera pulverizada.</p>
    <h3>Energía Calma (Zenergy)</h3>
    <p>Gracias a la combinación de cafeína y L-teanina, el matcha proporciona un estado de alerta relajado que puede durar hasta 6 horas, sin los picos y caídas asociados con el café.</p>
    <p>Además, está cargado de antioxidantes, especialmente EGCG, conocido por sus propiedades protectoras contra el daño celular.</p>
    `,
    image: "https://info.ehl.edu/hubfs/Blog-EHL-Insights/Images-EHL-Insights/EHL-Passugg_Blog_Matcha_Header.jpg",
    alt: "Taza de té matcha"
},
{
    id: 3,
    title: "Mindfulness para Principiantes",
    description: "En un mundo lleno de distracciones, aprender a estar presente es una habilidad vital. Te enseñamos 5 ejercicios simples.",
    fullContent: `
    <p>Mindfulness, o atención plena, es simplemente el acto de prestar atención al momento presente sin juzgar. Suena fácil, pero en nuestra cultura de hiperconexión, es un desafío radical.</p>
    <h3>Empieza por la respiración</h3>
    <p>No necesitas 30 minutos. Empieza con 3 respiraciones conscientes antes de comer, o al despertarte. Siente el aire entrar y salir. Eso es todo. Eso es mindfulness.</p>
    <p>La práctica constante reduce el estrés, mejora la concentración y aumenta la inteligencia emocional. Es el gimnasio de la mente.</p>
    `,
    image: "https://neuro.wharton.upenn.edu/wp-content/uploads/2020/04/iStock-Blog2-e1585773724832.jpg",
    alt: "Persona meditando"
}
];

const handleReadMore = (post) => {
setSelectedPost(post);
window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleCloseArticle = () => {
setSelectedPost(null);
};


return (
<div className={`main-blog-wrapper ${selectedPost ? 'split-mode-active' : ''}`}>
    {!selectedPost && <h1 className="blog-title-main">Nuestro Blog</h1>}


    <div className="content-area-flex">
    {selectedPost && (
        <main className="full-article-container left-panel-animation">
        <button className="close-btn" onClick={handleCloseArticle}>
            ← Volver a la lista
        </button>
        
        <article className="full-article-content">
            <img 
            src={selectedPost.image} 
            alt={selectedPost.alt} 
            className="full-article-hero-image" 
            />
            <h1 className="full-article-title">{selectedPost.title}</h1>
            <div 
            className="article-body-text"
            dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
            />
        </article>
        </main>
    )}

    <aside className={`posts-list-wrapper ${selectedPost ? 'sidebar-mode' : ''}`}>
        {mockPosts.map((post) => {
            const isActive = selectedPost && selectedPost.id === post.id;

            return (
        <article key={post.id} className={`blog-card ${isActive ? 'active-card-in-list' : ''}`}>
            <div className="card-image-wrapper">
            <div className="image-background-effect">
                <img src={post.image} alt={post.alt} className="card-image" />
            </div>
            </div>
            <div className="card-content">
            <h2 className="card-title">{post.title}</h2>
            <div className="title-divider"></div>
            <p className="card-description">{post.description}</p>
            <button 
                className="read-more-btn"
                onClick={() => handleReadMore(post)}
            >
                Leer Más
            </button>
            </div>
        </article>
        )})}
    </aside>

    </div>
</div>
);
};

export default Blog;