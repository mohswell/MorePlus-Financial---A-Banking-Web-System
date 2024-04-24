import pytest
from app import app

# Create a test client using the Flask application configured for testing
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def get_auth_token(client):
    response = client.post('/auth', json={"username": "Mohammed", "password": "password"})
    return response.json.get('access_token', '')

# Test getting all accounts for a specific user by ID
def test_get_all_accounts_for_user(client):
    response = client.get('/users/1/accounts')
    assert response.status_code == 200
    assert isinstance(response.json, list)

# Test getting all accounts for a non-existent user
def test_get_all_accounts_for_non_existent_user(client):
    response = client.get('/users/999/accounts')
    assert response.status_code == 404
    assert 'error' in response.json

# Test getting accounts for a user with invalid user ID format
def test_get_accounts_for_user_with_invalid_id_format(client):
    response = client.get('/users/invalid_id/accounts')
    assert response.status_code == 400
    assert 'error' in response.json

# Test adding a new account for a specific user by ID with valid data
def test_add_account_for_user_with_valid_data(client):
    auth_token = get_auth_token(client)
    
    account_data = {
        "type": "savings",
        "balance": 1000.0
    }
    response = client.post('/users/1/accounts', json=account_data, headers={'Authorization': f'Bearer {auth_token}'})
    assert response.status_code == 201
    assert 'account' in response.json

# Test adding a new account for a non-existent user
def test_add_account_for_non_existent_user(client):
    auth_token = get_auth_token(client)
    account_data = {
        "type": "savings",
        "balance": 1000.0
    }
    response = client.post('/users/999/accounts', json=account_data, headers={'Authorization': f'Bearer {auth_token}'})
    
    assert response.status_code == 404
    assert 'User not found' in response.json['error']

# Test adding a new account for a specific user by ID with missing parameters
def test_add_account_for_user_with_missing_parameters(client):
    auth_token = get_auth_token(client)
    account_data = {
        "type": "savings"
    }
    response = client.post('/users/1/accounts', json=account_data, headers={'Authorization': f'Bearer {auth_token}'})
    assert response.status_code == 400
    assert 'error' in response.json

if __name__ == "__main__":
    pytest.main()