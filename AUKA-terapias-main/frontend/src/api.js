import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// SOLO conservamos este mapper para Categorías porque el Navbar necesita 'nombre' y 'slug'
const formatCategory = (item) => ({
    id: item.id,
    nombre: item.nombre_cat, 
    slug: item.nombre_cat.toLowerCase().trim().replace(/\s+/g, '-') 
});

export const productApi = {

    // --- PRODUCTOS ---

    // Este es el método que usa tu Navbar para cargar todo al inicio
    getProducts: async () => {
        try {
            const response = await apiClient.get('/productos/');
            return response.data;
        } catch (error) {
            console.error("Error obteniendo todos los productos:", error);
            return [];
        }
    },

    getCosmeticos: async () => {
        try {
            const response = await apiClient.get('/productos/', {
                params: { categoria: 'cosmetica' } 
            });
            return response.data; 
        } catch (error) {
            console.error("Error obteniendo cosméticos:", error);
            throw error;
        }
    },

    getByCategory: async (categoryName) => {
        try {
            const response = await apiClient.get('/productos/', {
                params: { categoria: categoryName }
            });
            return response.data;
        } catch (error) {
            console.error("Error obteniendo categoría:", error);
            return [];
        }
    },

    getById: async (id) => {
        try {
            const response = await apiClient.get(`/productos/${id}/`);
            return response.data;
        } catch (error) {
            console.error("Error obteniendo producto:", error);
            throw error;
        }
    },

    // --- FUNCIONALIDAD DE BÚSQUEDA ---
    // Esta función descarga todo y filtra letra por letra en Nombre y Beneficios
    searchProducts: async (searchTerm) => {
        try {
            // 1. Obtenemos todos los productos desde la API
            const response = await apiClient.get('/productos/');
            const allProducts = response.data;
            
            // 2. Normalizamos el término a minúsculas
            const term = searchTerm.toLowerCase();
        
            // 3. Filtramos
            return allProducts.filter(producto => {
                // Validamos campos: soporta 'nombre' O 'nombre_prod' según venga del backend
                const nombreRaw = producto.nombre || producto.nombre_prod || "";
                const beneficiosRaw = producto.beneficios || producto.beneficios_prod || "";

                const nombre = nombreRaw.toLowerCase();
                const beneficios = beneficiosRaw.toLowerCase();
        
                // Retorna TRUE si el nombre O los beneficios incluyen el término (letra por letra)
                return nombre.includes(term) || beneficios.includes(term);
            });
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            return [];
        }
    },

    // --- CRUD ---

    create: async (productData) => {
        const response = await apiClient.post('/productos/', productData);
        return response.data;
    },

    update: async (id, productData) => {
        const response = await apiClient.put(`/productos/${id}/`, productData);
        return response.data;
    },

    patch: async (id, partialData) => {
        const response = await apiClient.patch(`/productos/${id}/`, partialData);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/productos/${id}/`);
        return response.data;
    },

    // --- CATEGORÍAS ---

    getCategories: async () => {
        try {
            const response = await apiClient.get('/categorias/');
            // Mapeamos para que el Navbar reciba { id, nombre, slug }
            return response.data.map(formatCategory);
        } catch (error) {
            console.error("Error cargando categorías:", error);
            return []; 
        }
    },

    // --- EXTRAS ---

    getFeatured: async () => {
        try {
            const response = await apiClient.get('/destacado/', {
                params: { page_size: 100 }
            });
            return response.data;
        } catch (error) {
            console.error("Error cargando destacados:", error);
            return [];
        }
    },

    getMarqueeMessages: async () => {
        try {
            const response = await apiClient.get('/cintillo/');
            return response.data;
        } catch (error) {
            console.error("Error cargando cintillo:", error);
            return [];
        }
    },
};