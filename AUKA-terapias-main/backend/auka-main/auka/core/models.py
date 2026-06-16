from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.db.models import Q
# Create your models here.

class Categoria(models.Model):
    nombre_cat = models.CharField(max_length=40, verbose_name='nombre')
    descripcion_cat = models.TextField(verbose_name='descipcion')
    
    def __str__(self):
        return self.nombre_cat
class Producto(models.Model):
    # ... (Tus campos anteriores: TIPOS_PRODUCTO, nombre_prod, tipo, precio_prod, etc... siguen igual) ...
    # ... No cambies nada de los campos ...

    TIPOS_PRODUCTO = [
        ('spray', 'Spray'),
        ('roll-on', 'Roll-on'),
        ('serum', 'Serum'),
        ('barra', 'Barra'),
        ('ungüento', 'Ungüento'),
    ]

    nombre_prod = models.CharField(max_length=60, verbose_name='producto')
    tipo = models.CharField(max_length=20, choices=TIPOS_PRODUCTO, default='spray', verbose_name='Tipo de presentación')
    precio_prod = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    descripcion_prod = models.TextField(verbose_name='descipcion')
    img_prod = models.ImageField(upload_to='producto/')
    beneficio_prod = models.CharField(max_length=200)
    categorias = models.ManyToManyField(Categoria, related_name="productos", blank=True)
    stock = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre_prod} ({self.get_tipo_display()}) - ${self.precio_prod}"
    
    @property
    def precio_actual(self):
        ahora = timezone.now()
        
        # LÓGICA MEJORADA:
        # Buscamos ofertas que estén activas Y en fecha.
        # Condición 1: El producto está explícitamente seleccionado (Q(productos=self))
        # Condición 2: La oferta es para TODOS (aplicar_a_todos=True) Y el producto NO está excluido (~Q(productos_excluidos=self))
        
        oferta_activa = Oferta.objects.filter(
            activa=True,
            fecha_inicio__lte=ahora,
            fecha_fin__gte=ahora
        ).filter(
            Q(productos=self) | 
            (Q(aplicar_a_todos=True) & ~Q(productos_excluidos=self))
        ).order_by('-porcentaje_descuento').first()
        
        if oferta_activa:
            descuento = (self.precio_prod * oferta_activa.porcentaje_descuento) / Decimal(100)
            return round(self.precio_prod - descuento, 2)
            
        return self.precio_prod      

    @property
    def tiene_descuento(self):
        return self.precio_actual < self.precio_prod

# ... El resto de tus modelos (Servicios, ProductoDestacado, Oferta, Blog) siguen igual ...
class Servicios(models.Model):
    nombre_serv=models.CharField(max_length=50,
                                verbose_name='nombre')
    descripcion_serv=models.TextField()
    img_serv=models.ImageField(upload_to='servicio/')
    precio_serv=models.DecimalField(max_digits=10,decimal_places=2,validators=[MinValueValidator(0.00)])

    def __str__(self):
        return f"{self.nombre_serv} (${self.precio_serv})"


class ProductoDestacado(models.Model):
    producto = models.ForeignKey(
        Producto, 
        on_delete=models.CASCADE,
        related_name='destacados',
        verbose_name='Producto destacado'
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True, verbose_name='¿Activo?')
    orden = models.PositiveIntegerField(
        default=0,
        help_text='Orden de aparición (mayor número = más prioritario)'
    )
    
    class Meta:
        verbose_name = 'Producto destacado'
        verbose_name_plural = 'Productos destacados'
        ordering = ['-orden', '-fecha_creacion']
    
    def __str__(self):
        return f"Destacado: {self.producto.nombre_prod}"

    # --- 2. AGREGAMOS LA LÓGICA DE VALIDACIÓN ---
    def clean(self):
        """
        Este método verifica que no haya más de 4 activos antes de guardar.
        """
        # Solo verificamos si se está intentando guardar como 'activo'
        if self.activo:
            # Contamos cuántos hay activos actualmente, EXCLUYENDO el que estamos editando (self.pk)
            cantidad_actual = ProductoDestacado.objects.filter(activo=True).exclude(pk=self.pk).count()

            if cantidad_actual >= 4:
                raise ValidationError("⚠️ Límite alcanzado: Solo puedes tener 4 productos destacados activos al mismo tiempo. Desactiva o borra uno antes de agregar otro.")

    def save(self, *args, **kwargs):
        # Forzamos la ejecución de la validación antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)
class Oferta(models.Model):
    nombre = models.CharField(max_length=100, help_text="Ej:'Oferta de Invierno', 'Liquidación Final' ")
    
    # Campo 1: Inclusión explícita (Productos específicos)
    productos = models.ManyToManyField(
        'Producto', 
        related_name='ofertas', 
        blank=True,
        verbose_name="Productos específicos",
        help_text="Selecciona productos si la oferta es solo para algunos."
    )
    
    # Campo 2: Aplicar a todo el catálogo
    aplicar_a_todos = models.BooleanField(
        default=False, 
        verbose_name="¿Aplicar a TODO el catálogo?",
        help_text="Si marcas esto, la oferta aplicará a todos los productos, excepto los que pongas en 'excluidos'."
    )
    
    # Campo 3: Exclusión (Todos menos estos)
    productos_excluidos = models.ManyToManyField(
        'Producto', 
        related_name='ofertas_excluidas', 
        blank=True,
        verbose_name="Productos excluidos",
        help_text="Si aplicas a todos, selecciona aquí los que NO quieres que tengan descuento."
    )

    porcentaje_descuento = models.DecimalField(max_digits=5, decimal_places=2, help_text="Porcentaje de descuentos(ej: 15 para un 15%)")
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    activa = models.BooleanField(default=False)

    # --- CAMBIO AQUÍ: Eliminamos el método clean() conflictivo ---
    # La lógica en Producto ya maneja la prioridad correctamente, 
    # así que no necesitamos bloquear al administrador aquí.

    def __str__(self):
        tipo = "Global" if self.aplicar_a_todos else "Específica"
        return f"{self.nombre} ({self.porcentaje_descuento}%) - {tipo}"

    class Meta:
        ordering = ['-fecha_fin']

class Blog(models.Model):
    titulo=models.CharField(max_length=250)
    contenido=models.TextField()
    fecha_publicacion=models.DateTimeField()
    fecha_modificacion = models.DateTimeField(
        auto_now=True,
        verbose_name="Última modificación"
    )
    activa=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.titulo} {self.activa}"
    class Meta:
        ordering = ['-fecha_publicacion']
        

# core/models.py

class MensajeCintillo(models.Model):
    texto = models.CharField(max_length=255, verbose_name="Texto del mensaje")
    enlace = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Opcional. Ej: '/cosmetica' para interno o 'https://instagram.com' para externo."
    )
    activo = models.BooleanField(default=True, verbose_name="¿Mostrar en la web?")
    orden = models.PositiveIntegerField(default=0, help_text="Orden de aparición")

    class Meta:
        verbose_name = "Mensaje Cintillo"
        verbose_name_plural = "Mensajes Cintillo"
        ordering = ['orden']

    def __str__(self):
        return self.texto