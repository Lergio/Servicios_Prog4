# mi_aplicacion/admin.py
from django.contrib import admin
from .models import Usuario, Servicio, Solicitud, Calificacion

# Registra los modelos en el admin
admin.site.register(Usuario)
admin.site.register(Servicio)
admin.site.register(Solicitud)
admin.site.register(Calificacion)
