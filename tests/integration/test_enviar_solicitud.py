import pytest
import requests

# Simula el login para obtener el token dinámicamente
@pytest.fixture
def auth_token_and_user_id():
    # Datos del login, puedes ajustarlos con credenciales de prueba
    login_data = {
        'username': 'Colo',
        'password': 'col123'
    }

    # URL de login (cambia a la URL real de tu API)
    login_url = 'http://181.199.159.26:8000/api/auth/login/'

    # Realizamos la solicitud POST para hacer login
    response = requests.post(login_url, data=login_data)

    # Verificamos que el login fue exitoso
    assert response.status_code == 200

    # Obtenemos el token y el user_id desde la respuesta
    data = response.json()
    access_token = data['access']
    user_id = data['user']['id']

    return access_token, user_id

# Fixture para obtener la URL de la API de solicitudes
@pytest.fixture
def solicitudes_url():
    return 'http://181.199.159.26:8000/api/solicitudes/'

@pytest.fixture
def servicio_id_and_oferente(auth_token_and_user_id):
    # Usamos el login para obtener el user_id y el token
    auth_token, user_id = auth_token_and_user_id

    # Suponemos que ya existe un servicio publicado por el usuario
    # Vamos a crear un servicio para simular que hay un servicio disponible para ser solicitado.
    servicio_data = {
        "titulo": "Clases de Matemáticas",
        "descripcion": "Clases particulares de matemáticas",
        "categoria": "venta",
        "duracion_estimada": "1 hora",
        "disponibilidad_horaria": "Lunes a Viernes de 18:00 a 20:00",
        "id_oferente": user_id
    }

    # URL del servicio (cambia a la URL real de tu API)
    api_servicios_url = 'http://181.199.159.26:8000/api/servicios/'

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }

    # Crear el servicio
    response = requests.post(api_servicios_url, json=servicio_data, headers=headers)

    assert response.status_code == 201
    servicio_id = response.json()['id']

    return servicio_id, user_id, auth_token

def test_enviar_solicitud(solicitudes_url, servicio_id_and_oferente):
    servicio_id, user_id, auth_token = servicio_id_and_oferente

    # Datos de la solicitud
    solicitud_data = {
        "id_servicio": servicio_id,
        "id_busqueda": user_id,  # El solicitante es el mismo usuario (esto puede variar)
        "comentario": "Me gustaría tomar clases de matemáticas",
        "estado": "pendiente"
    }

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }

    # 1. Enviar la solicitud
    response = requests.post(solicitudes_url, json=solicitud_data, headers=headers)

    # Verificar que la solicitud se haya creado correctamente
    assert response.status_code == 201
    solicitud_id = response.json()['id']

    # 2. Verificar que la solicitud se creó correctamente
    get_response = requests.get(f"{solicitudes_url}{solicitud_id}", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()['comentario'] == solicitud_data['comentario']
    assert get_response.json()['estado'] == "pendiente"
    assert get_response.json()['id_servicio'] == servicio_id

    # 3. Limpiar después de la prueba: Eliminar la solicitud con una solicitud DELETE
    delete_response = requests.delete(f"{solicitudes_url}{solicitud_id}", headers=headers)
    assert delete_response.status_code == 204  # 204 indica que la eliminación fue exitosa

    # Limpiar después de la prueba: Eliminar el servicio con una solicitud DELETE
    # URL del servicio (cambia a la URL real de tu API)
    servicios_url = 'http://181.199.159.26:8000/api/servicios/'
    delete_response = requests.delete(f"{servicios_url}{servicio_id}", headers=headers)
    
    assert delete_response.status_code == 204  # 204 indica que la eliminación fue exitosa

    # Opcional: Verificar que la solicitud ha sido eliminada
    get_response_after_delete = requests.get(f"{solicitudes_url}{solicitud_id}", headers=headers)
    assert get_response_after_delete.status_code == 404  # La solicitud ya no debe existir
