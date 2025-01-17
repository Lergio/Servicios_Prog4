from rest_framework import serializers
from .models import Usuario, Servicio, Solicitud, Calificacion
from django.contrib.auth import authenticate

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class SolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitud
        fields = '__all__'

class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = '__all__'

#class AuthSerializer(serializers.Serializer):
#    email = serializers.EmailField()
#    password = serializers.CharField(write_only=True)  # Cambia 'contraseña' a 'password'

#    def validate(self, attrs):
#        email = attrs.get('email')
#        password = attrs.get('password')  # Cambia 'contraseña' a 'password'

#        user = authenticate(username=email, password=password)  # Cambia 'contraseña' a 'password'
#        if user is None:
#            raise serializers.ValidationError('Credenciales inválidas')

#        attrs['user'] = user
#        return attrs
