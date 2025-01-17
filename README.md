# React + Vite

# Proyecto de Gestión de Servicios

## Descripción

Este proyecto es una plataforma para ofrecer y gestionar servicios. Los usuarios pueden registrarse, iniciar sesión, ofrecer servicios, actualizar sus servicios y eliminarlos. Además, pueden ver y editar su perfil personal. El sistema está basado en React para el frontend y se conecta a una API REST para gestionar las operaciones de los servicios y la autenticación de usuarios.

## Componentes Principales

### 1. **Register.jsx**

El componente **Register.jsx** es el formulario de registro de nuevos usuarios en la plataforma. Permite a los usuarios crear una cuenta proporcionando su nombre de usuario, correo electrónico, contraseña y nombre completo.

#### Funcionalidad:
- **Formulario de Registro**: Permite al usuario ingresar su nombre de usuario, correo electrónico, contraseña y nombre completo.
- **Autenticación y Almacenamiento de Tokens**: Después de un registro exitoso, se almacenan los tokens de autenticación (`accessToken` y `refreshToken`) en el `localStorage` para mantener la sesión del usuario activa.
- **Redirección**: Luego de registrarse, el usuario es redirigido a la página de inicio de sesión.

---

### 2. **Login.jsx**

El componente **Login.jsx** maneja el inicio de sesión de los usuarios registrados. Permite a los usuarios ingresar su correo electrónico y contraseña para acceder a la plataforma.

#### Funcionalidad:
- **Formulario de Inicio de Sesión**: Solicita al usuario que ingrese su correo electrónico y contraseña.
- **Autenticación**: Realiza una solicitud `POST` a la API para verificar las credenciales del usuario. Si las credenciales son correctas, almacena los tokens de autenticación en el `localStorage`.
- **Redirección**: Después de un inicio de sesión exitoso, el usuario es redirigido al panel de control (`Dashboard.jsx`).

---

### 3. **Dashboard.jsx**

El componente **Dashboard.jsx** actúa como el panel de control para los usuarios autenticados. Después de iniciar sesión, los usuarios pueden acceder a las funciones de gestión de servicios, ver los servicios que han ofrecido y administrar su cuenta.

#### Funcionalidad:
- **Verificación de Autenticación**: Asegura que solo los usuarios autenticados puedan acceder al dashboard. Si no hay un token de acceso en el `localStorage`, el usuario es redirigido al inicio de sesión.
- **Listado de Servicios**: Muestra los servicios que el usuario ha creado o gestionado. Permite interactuar con estos servicios (ver detalles, editar o eliminar).
- **Navegación**: Proporciona un acceso rápido a otras funcionalidades, como agregar un nuevo servicio o actualizar el perfil.

---

### 4. **Home.jsx**

El componente **Home.jsx** es la página de inicio visible para los usuarios que no han iniciado sesión aún. Proporciona enlaces para que los usuarios puedan registrarse o iniciar sesión en la plataforma.

#### Funcionalidad:
- **Interfaz de Bienvenida**: Muestra un mensaje de bienvenida y presenta la plataforma a los nuevos usuarios.
- **Enlaces de Navegación**: Ofrece botones o enlaces para registrarse o iniciar sesión, dependiendo de si el usuario ya tiene una cuenta.
- **Descripción General de la Plataforma**: Muestra las funcionalidades principales de la plataforma, como la capacidad de ofrecer servicios.

---

### 5. **Profile.jsx**

El componente **Profile.jsx** permite a los usuarios ver y editar su perfil personal. Aquí pueden actualizar sus datos, como su nombre, correo electrónico, etc.

#### Funcionalidad:
- **Cargar Datos del Perfil**: Al cargar el componente, se hace una solicitud `GET` para obtener los datos del perfil del usuario desde la API.
- **Editar Perfil**: Permite a los usuarios editar sus datos (nombre, correo electrónico, etc.) y actualizar la información en la base de datos mediante una solicitud `PATCH`.
- **Verificación de Autenticación**: Solo los usuarios autenticados pueden acceder a la página de perfil.

---

### 6. **ServiceForm.jsx**

El componente **ServiceForm.jsx** permite a los usuarios ofrecer un nuevo servicio. Incluye un formulario donde se especifican los detalles del servicio, como el título, la descripción, la categoría, la duración estimada y la disponibilidad horaria.

#### Funcionalidad:
- **Formulario de Creación de Servicio**: Permite ingresar información sobre un servicio (título, descripción, categoría, duración, disponibilidad).
- **Envío de Datos a la API**: Los datos del servicio se envían a la API mediante una solicitud `POST`. El servicio creado se asocia con el usuario mediante su ID.
- **Cierre del Formulario**: El formulario puede cerrarse después de agregar un servicio, notificando al componente padre (como el `Dashboard.jsx`) que un servicio ha sido agregado.

---

### 7. **ServiceUpdate.jsx**

El componente **ServiceUpdate.jsx** permite a los usuarios editar los servicios que han ofrecido previamente. Carga los datos existentes del servicio y los presenta en un formulario editable.

#### Funcionalidad:
- **Carga de Servicio**: Realiza una solicitud `GET` para cargar los datos del servicio que se va a actualizar.
- **Edición de Servicio**: Permite editar los campos del servicio (título, descripción, etc.) y luego actualizar los cambios en la base de datos mediante una solicitud `PATCH`.
- **Confirmación de Actualización**: Después de que el servicio se actualiza correctamente, el componente notifica al componente padre que el servicio ha sido actualizado.

---

### 8. **ServiceDelete.jsx**

El componente **ServiceDelete.jsx** permite a los usuarios eliminar un servicio que han ofrecido previamente. Muestra los detalles del servicio y solicita confirmación antes de proceder con la eliminación.

#### Funcionalidad:
- **Carga de Servicio**: Al igual que **ServiceUpdate.jsx**, este componente realiza una solicitud `GET` para obtener los detalles del servicio que se desea eliminar.
- **Confirmación de Eliminación**: Muestra un mensaje que solicita confirmación para eliminar el servicio.
- **Eliminación de Servicio**: Si el usuario confirma la eliminación, realiza una solicitud `DELETE` a la API para eliminar el servicio.
- **Notificación y Cierre**: Después de eliminar el servicio, notifica al componente padre que el servicio ha sido eliminado y cierra el formulario.

---

## Autenticación y Seguridad

---

La autenticación es gestionada a través de tokens JWT. Los componentes que requieren autenticación, como el **Dashboard.jsx**, **Profile.jsx**, y la gestión de servicios, comprueban la existencia de un `accessToken` en el `localStorage` antes de permitir al usuario realizar cualquier acción. Los tokens son almacenados durante la sesión y se utilizan en las solicitudes a la API para garantizar que las acciones del usuario estén autorizadas.

---

#Dockerfile para generar django-container
Usar una imagen base de Python FROM python:3.9
Establecer el directorio de trabajo WORKDIR /app
Copiar los archivos de requisitos COPY requirements.txt .
Instalar las dependencias RUN pip install --no-cache-dir -r requirements.txt
Copiar el resto de la aplicación COPY . .
Exponer el puerto que usará la aplicación EXPOSE 8000
Comando para ejecutar la aplicación con Gunicorn CMD ["gunicorn", "proyectos.wsgi:application", "--bind", "0.0.0.0:8000"]
requirements.txt
Django>=3.2,<4.0 djangorestframework mysqlclient drf-yasg gunicorn

generar imagen docker
docker build -t django-container .

correr docker mysql-container se monta el volumen mysql en la raiz del proyecto para mantener la persistencia
docker run --rm -d --name mysql-container --network deploy1 -e TZ=America/Argentina/Buenos_Aires -e MYSQL_ROOT_PASSWORD=hernanf10 -e MYSQL_DATABASE=app -e MYSQL_USER=user -e MYSQL_PASSWORD=hernanf10 -v "$PWD"/mysql:/var/lib/mysql mysql:8.0-debian --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

crear proyecto - se ejecuta la primera vez
docker run --rm --name django-container --network deploy1 --link mysql-container:mysql -p 8000:8000 -it -v "$PWD":/app django-container django-admin startproject proyectos

crear app - se ejecuta la primera vez
docker run --rm --name django-container --network deploy1 --link mysql-container:mysql -p 8000:8000 -it -v "$PWD"/proyectos:/app django-container python manage.py startapp servicios

correr docker django-container
docker run --rm --name django-container --network deploy1 --link mysql-container:mysql -p 8000:8000 -d -v "$PWD"/proyectos:/app django-container

correr docker adminer
docker run --rm -it -d --name adminer --network deploy1 -p 9000:8080 adminer:latest

correr docker nginx
docker run --rm --name nginx-container --network deploy1 -d -p 80:80 -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf" -v "$PWD/proyectos/staticfiles:/app/staticfiles" nginx

archivo nginx.conf en la raiz del proyecto
server { listen 8080; server_name 181.199.159.26/; # dominio o IP

location /static/ {
    alias /app/staticfiles/;  # Ruta donde se encuentran los archivos estáticos
}

location / {
    proxy_pass http://django-container:8000;  # Nombre del contenedor de Django
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
}

generar el siguiente modelo de datos
Diagrama Entidad-Relación (DER) Usuarios
id (PK)
nombre
email
contraseña
rol (oferente, buscador, ambos)
Servicios
id (PK)
titulo
descripcion
categoria (tecnologia, gastronomia, mantenimiento, salud, maestranza, ocio, gerontologia, venta)
duracion_estimada
disponibilidad_horaria
id_oferente (FK -> Usuarios.id)
Solicitudes
id (PK)
id_servicio (FK -> Servicios.id)
id_busqueda (FK -> Usuarios.id)
comentario
estado (pendiente, aceptada, rechazada)
Calificaciones
id (PK)
id_servicio (FK -> Servicios.id)
id_busqueda (FK -> Usuarios.id)
calificacion (1-5)
comentario
conectar mysqlclient
con datos de la base mysql

en setting.py DATABASES = { 'default': { 'ENGINE': 'django.db.backends.mysql', 'NAME': 'app', 'USER': 'user', 'PASSWORD': 'hernanf10', 'HOST': 'mysql-container', 'PORT': '3306', } }

migraciones
docker exec -it django-container python manage.py makemigrations docker exec -it django-container python manage.py migrate

INSTALLED_APPS settings.py
servicios djangorestframework drf-yasg

generar api para crud de las entidades
generar doc swager/openapi
habilitar admin django para la aplicacion
en admin.py
