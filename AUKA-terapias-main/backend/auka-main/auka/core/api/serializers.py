from rest_framework import serializers
from django.core.validators import MinValueValidator

# --- CORRECCIÓN IMPORTANTE: ---
# Importamos TODOS los modelos desde 'core.models' en una sola línea.
# Esto evita errores de rutas relativas (. o ..).
from core.models import (
    Producto, 
    Categoria, 
    Oferta, 
    ProductoDestacado, 
    MensajeCintillo
)

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre_cat', 'descripcion_cat']

class ProductoSerializer(serializers.ModelSerializer):
    precio_actual = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tiene_descuento = serializers.BooleanField(read_only=True)
    categorias = CategoriaSerializer(many=True, read_only=True)
    
    # OPCIONAL: Si quieres que el frontend reciba "Roll-on" en vez de "roll-on"
    tipo_descripcion = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id', 
            'nombre_prod', 
            'precio_prod',     
            'precio_actual',   
            'tiene_descuento', 
            'img_prod', 
            'stock',
            'categorias',
            'beneficio_prod',
            'tipo',              
            'tipo_descripcion',
            'descripcion_prod'  
        ]

class CategoriaConProductosSerializer(serializers.ModelSerializer):
    productos = ProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Categoria
        fields = ['id', 'nombre_cat', 'productos']

class OfertasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oferta
        fields = ['nombre', 'productos', 'porcentaje_descuento', 'fecha_fin', 'activa'] 

class ProductoDestacadoSerializer(serializers.ModelSerializer):
    
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = ProductoDestacado
        fields = [
            'id', 
            'orden', 
            'activo',
            'producto'
        ]
        
class MensajeCintilloSerializer(serializers.ModelSerializer):
    class Meta:
        model = MensajeCintillo
        fields = ['id', 'texto', 'enlace']