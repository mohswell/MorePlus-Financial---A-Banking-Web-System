import pytest
import json
from app import app

# Create a test client using the Flask application configured for testing
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def get_access_token(client):
    response = client.post('/auth', json={"username": "Mohammed", "password": "password"})
    return response.json.get('access_token', '')

def test_get_all_users(client):
    access_token = get_access_token(client)
    headers = {'Authorization': 'Bearer ' + access_token}
    response = client.get('/users', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_user_with_valid_data(client):
    access_token = get_access_token(client)
    headers = {'Authorization': 'Bearer ' + access_token}
    user_data = {
        "name": "Jeremiah Grealish",
        "email": "grealish@city.com"
    }
    response = client.post('/users', json=user_data, headers=headers)
    assert response.status_code == 201
    assert 'user_id' in response.json
    assert 'user_data' in response.json

def test_create_user_with_missing_parameters(client):
    access_token = get_access_token(client)
    headers = {'Authorization': 'Bearer ' + access_token}
    user_data = {
        "email": "haaland@example.com"
    }
    response = client.post('/users', json=user_data, headers=headers)
    assert response.status_code == 400
    assert 'error' in response.json

def test_get_specific_user_by_id(client):
    access_token = get_access_token(client)
    headers = {'Authorization': 'Bearer ' + access_token}
    response = client.get('/users/1', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, dict)

def test_delete_last_user(client):
    access_token = get_access_token(client)
    headers = {'Authorization': 'Bearer ' + access_token}
    
    # Get all users to ensure there are existing users
    response = client.get('/users', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0
    
    # Get the ID of the last user
    last_user_id = response.json[0]['users'][-1]['_id']
    
    # Delete the last user
    response = client.delete(f'/users/{last_user_id}', headers=headers)
    assert response.status_code == 200
    assert response.json.get('message') == 'User deleted successfully'

def test_get_accounts_for_specific_user(client):
    access_token = get_access_token(client)
    headers = {'Authorization': 'Bearer ' + access_token}
    response = client.get('/users/1/accounts', headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json, list)

if __name__ == "__main__":
    pytest.main()