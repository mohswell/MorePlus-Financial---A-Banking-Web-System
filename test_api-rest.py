import pytest
import json
from app import app

# Create a test client using the Flask application configured for testing
@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

# Authentication enpoint('/auth')
def test_valid_credentials(client):
    # Test valid authentication credentials
    valid_credentials = {}
    valid_credentials = {"username": "Mohammed", "password": "password"}
    response = client.post("/auth", json=valid_credentials)
    assert response.status_code == 200
    assert "access_token" in response.json

def test_invalid_credentials(client):
    # Test invalid authentication credentials
    invalid_credentials = {"username": "admin", "password": "admin_password"}
    response = client.post("/auth", json=invalid_credentials)
    assert response.status_code == 401
    assert "error" in response.json

def test_missing_username(client):
    # Test missing username parameter in the request
    missing_username = {"password": "password"}
    response = client.post("/auth", json=missing_username)
    assert response.status_code == 400
    assert "error" in response.json

def test_missing_password(client):
    # Test missing password in the request
    missing_password = {"username": "admin"}
    response = client.post("/auth", json=missing_password)
    assert response.status_code == 400
    assert "error" in response.json

def test_empty_credentials(client):
    # Test with empty username and password
    empty_credentials = {"username": "", "password": ""}
    response = client.post("/auth", json=empty_credentials)
    assert response.status_code == 401
    assert "error" in response.json
    
def test_invalid_json_request(client):
    # Test with invalid JSON format
    invalid_json = 'invalid_json'
    response = client.post('/auth', data=invalid_json, content_type='application/json')
    assert response.status_code == 400
    assert response.json is None  # Check if response.json is None

# Add more test cases for other endpoints as needed

if __name__ == "__main__":
    pytest.main()
