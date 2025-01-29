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

# Fixture para obtener la URL de la API
@pytest.fixture
def api_url():
    return 'http://181.199.159.26:8000/api/servicios/'

@pytest.fixture
def servicio_data():
    return {
        "titulo": "Clases de Matemáticas",
        "descripcion": "Clases particulares de matemáticas",
        "categoria": "venta",
        "duracion_estimada": "1 hora",
        "disponibilidad_horaria": "Lunes a Viernes de 18:00 a 20:00"
    }

def test_publicar_servicio(api_url, servicio_data, auth_token_and_user_id):
    # Extraemos el token y el user_id de la fixture
    auth_token, user_id = auth_token_and_user_id

    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }

    # Agregar el id_oferente a los datos del servicio
    servicio_data['id_oferente'] = user_id

    # Realizar la solicitud POST para crear el servicio
    response = requests.post(api_url, json=servicio_data, headers=headers)

    # Verificar que la respuesta es la esperada
    assert response.status_code == 201
    #assert response.json()['message'] == "Servicio publicado exitosamente"

    # Obtener el id del servicio recién creado (esto depende de la respuesta de la API)
    servicio_id = response.json().get('id')

    # Verificar que el servicio se creó correctamente con una solicitud GET
    get_response = requests.get(f"{api_url}{servicio_id}", headers=headers)
    
    assert get_response.status_code == 200
    assert get_response.json()['id_oferente'] == user_id
    assert get_response.json()['titulo'] == servicio_data['titulo']

    # Limpiar después de la prueba: Eliminar el servicio con una solicitud DELETE
    delete_response = requests.delete(f"{api_url}{servicio_id}", headers=headers)
    
    assert delete_response.status_code == 204  # 204 indica que la eliminación fue exitosa

    # Opcional: Verificar que el servicio ha sido eliminado
    get_response_after_delete = requests.get(f"{api_url}{servicio_id}", headers=headers)
    assert get_response_after_delete.status_code == 404  # El servicio ya no debe existir