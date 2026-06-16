import React, { useState, useEffect } from 'react';
import './ReelsCarrusel.css'; 

const ReelsCarrusel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reelsData, setReelsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReels = async () => {
            
            const accessToken = 'EAALy6evyj0YBPy1ZBQVE4nMg5OuqZAj4joZAuitkqpnSmgW5bDGwytiaWZAP7cRDHTMkv3Fk0f3ZBRFhOzZCaZBbbrHrnSIl9D6ZBWR8vZAvtAzN5aoqB1AxAyh4D1EIGDzfC2vo5w3a3JiBRRzsWyfOyhWP6g4ZAgg02FKaZAragbCZBAWeHiKrBEodkwlaoL7T77MUpRAZBvJne'; 
            const instagramId = '17841478304664572'; 

            const url = `https://graph.facebook.com/v20.0/${instagramId}/media?fields=id,media_type,media_url,permalink&access_token=${accessToken}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (data && data.data) {
                    const videos = data.data.filter(item => (item.media_type === 'VIDEO' || item.media_type === 'REEL') && item.media_url);
                    setReelsData(videos);
                } else if (data.error) {
                    console.error("Error de la API de Facebook:", data.error.message);
                }
            } catch (error) {
                console.error("Error al cargar los reels (ej. CORS):", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReels();
    }, []);

    const nextSlide = () => {
        if (reelsData.length === 0) return;
        setCurrentIndex((prevIndex) => 
            prevIndex === reelsData.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        if (reelsData.length === 0) return;
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? reelsData.length - 1 : prevIndex - 1
        );
    };

    if (isLoading) {
        return <div className="loading-message">Cargando reels...</div>;
    }

    if (reelsData.length === 0) {
        return <div className="error-message">No se pudieron cargar los reels. Revisa la consola (F12).</div>;
    }

    const currentReel = reelsData[currentIndex];


    return (
        <div className="reels-carousel-container">
            <button className="nav-arrow left" onClick={prevSlide}>
                <i className="fas fa-chevron-left"></i>
            </button>
            <video 
                key={currentReel.id}
                src={currentReel.media_url} 
                autoPlay
                muted 
                loop
                playsInline
                className="reel-video-player"
            />
            <a 
                href={currentReel.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="reel-overlay-link"
                aria-label="Ver este Reel en Instagram"
            >
                <i className="fab fa-instagram instagram-icon"></i>
            </a>

            <button className="nav-arrow right" onClick={nextSlide}>
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default ReelsCarrusel;