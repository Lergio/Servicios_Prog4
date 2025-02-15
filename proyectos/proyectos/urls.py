"""proyectos URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin  # Asegúrate de importar admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from servicios.views import UsuarioViewSet, ServicioViewSet, SolicitudViewSet, CalificacionViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Crear un enrutador y registrar los viewsets
router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'solicitudes', SolicitudViewSet)
router.register(r'calificaciones', CalificacionViewSet)

# Configuración de la documentación Swagger/OpenAPI
schema_view = get_schema_view(
   openapi.Info(
      title="API de Servicios",
      default_version='v1',
      description="Documentación de la API para el sistema de servicios",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@servicios.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# Definición de las URLs
urlpatterns = [
    path('admin/', admin.site.urls),      # Rutas del panel de administración
    path('api/', include(router.urls)),  # Incluir las rutas de la API
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # Documentación Swagger
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),  # Documentación ReDoc
]
