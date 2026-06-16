from rest_framework import viewsets, filters # Importamos filters para la búsqueda
from rest_framework.pagination import PageNumberPagination

# --- 1. IMPORTACIÓN DE MODELOS ---
from core.models import Producto, Categoria, ProductoDestacado, MensajeCintillo

# --- 2. IMPORTACIÓN DE SERIALIZERS ---
from .serializers import (
    ProductoSerializer, 
    CategoriaConProductosSerializer, 
    ProductoDestacadoSerializer, 
    MensajeCintilloSerializer
)

# --- CLASE DE PAGINACIÓN ---
class LargePagination(PageNumberPagination):
    page_size = 100          
    page_size_query_param = 'page_size' 
    max_page_size = 1000     

# --- VISTAS ---

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductoSerializer
    
    # 1. ACTIVAR EL BUSCADOR
    filter_backends = [filters.SearchFilter]
    
    # 2. DEFINIR EN QUÉ CAMPOS BUSCAR
    # Antes tenías ['nombre_prod', 'descripcion_prod', ...]
    # Ahora solo dejamos el nombre:
    search_fields = ['nombre_prod'] 
    
    def get_queryset(self):
        # Base: productos con stock
        queryset = Producto.objects.filter(stock=True).prefetch_related('ofertas', 'categorias')
        
        # Filtro adicional por categoría (si se usa el menú)
        nombre_cat = self.request.query_params.get('categoria')
        if nombre_cat:
            queryset = queryset.filter(categorias__nombre_cat__icontains=nombre_cat)
        
        return queryset

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.prefetch_related('productos').all()
    serializer_class = CategoriaConProductosSerializer

class ProductoDestacadoViewset(viewsets.ReadOnlyModelViewSet):
    queryset = ProductoDestacado.objects.select_related('producto').filter(activo=True).order_by('orden', '-fecha_creacion')
    serializer_class = ProductoDestacadoSerializer
    pagination_class = LargePagination 
    
class MensajeCintilloViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MensajeCintillo.objects.filter(activo=True).order_by('orden')
    serializer_class = MensajeCintilloSerializer
    pagination_class = None