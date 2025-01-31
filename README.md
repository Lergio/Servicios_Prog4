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

### 3. Dashboard

El **Dashboard** es la pantalla principal de la aplicación donde los usuarios pueden visualizar, crear, actualizar y solicitar servicios. 

### Funcionalidades principales:

- **Visualización de servicios**: Se muestra una lista de servicios publicados por los usuarios con detalles como título, descripción, duración estimada, disponibilidad horaria, categoría y el nombre del oferente.
- **Publicación de un servicio**: Los usuarios pueden publicar un nuevo servicio haciendo clic en el botón `Ofrecer Servicio`, lo que abre un formulario de creación.
- **Actualización de un servicio**: Los usuarios pueden actualizar los servicios que han publicado a través del botón `Actualizar`.
- **Eliminación de un servicio**: Si el usuario es el oferente del servicio, puede eliminarlo utilizando el botón `Borrar`.
- **Solicitud de servicio**: Si un usuario desea solicitar un servicio publicado por otra persona, puede hacerlo haciendo clic en el botón `Solicitar`, donde se le pedirá que agregue un comentario antes de confirmar la solicitud.

### Navegación:

El Dashboard cuenta con un **navbar** que permite acceder a las siguientes secciones:

- **Perfil**: Permite al usuario ver y modificar su información personal.
- **Mis Solicitudes**: Muestra las solicitudes enviadas por el usuario y su estado.
- **Salir**: Cierra sesión, eliminando los tokens de autenticación almacenados.

### Confirmaciones y Modales:

- **Confirmación de eliminación**: Antes de eliminar un servicio, se muestra un modal de confirmación.
- **Confirmación de solicitud**: Al solicitar un servicio, se muestra un modal para ingresar un comentario antes de enviar la solicitud.

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
### 9. Componente `ServiceRequestModal`

El componente `ServiceRequestModal` es un modal de React utilizado para que los usuarios puedan escribir y enviar una solicitud de servicio agregando un comentario.

### Funcionalidad:

- **Entrada de texto**: Permite al usuario escribir un comentario sobre la solicitud a través de un `textarea`.
- **Confirmación de solicitud**: Incluye un botón `Enviar` que ejecuta la función `confirmRequest` cuando el usuario confirma la solicitud.
- **Cierre del modal**: Dispone de un botón `Cancelar` que activa la función `onClose` para cerrar el modal sin enviar la solicitud.

---

### 10. **RequestPage.jsx**

El componente **RequestsPage.jsx** permite a los usuarios ver las solicitudes recibidas para los servicios que han publicado. Desde esta página, pueden aceptar o rechazar solicitudes según su disponibilidad.

#### Funcionalidad:
- **Carga de Solicitudes**: Obtiene las solicitudes relacionadas con los servicios publicados por el usuario autenticado.
- **Enriquecimiento de Datos**: Recupera información adicional como el nombre del solicitante y el título del servicio.
- **Gestión de Estado**: Permite actualizar el estado de una solicitud a aceptada o rechazada mediante una solicitud PATCH a la API.
- **Interfaz Interactiva**: Muestra las solicitudes con un diseño claro e intuitivo, permitiendo a los usuarios gestionar fácilmente sus peticiones.

---
### 11. Filtros de Búsqueda

El Dashboard permite filtrar los servicios por **título** y **categoría**. Esto facilita a los usuarios encontrar los servicios que buscan de manera más eficiente.

### Implementación

Se utilizan dos estados en React para almacenar los filtros:
- `filterTitle`: Para el título del servicio.
- `filterCategory`: Para la categoría del servicio.

---
## Autenticación y Seguridad

La autenticación es gestionada a través de tokens JWT. Los componentes que requieren autenticación, como el **Dashboard.jsx**, **Profile.jsx**, y la gestión de servicios, comprueban la existencia de un `accessToken` en el `localStorage` antes de permitir al usuario realizar cualquier acción. Los tokens son almacenados durante la sesión y se utilizan en las solicitudes a la API para garantizar que las acciones del usuario estén autorizadas.

---
