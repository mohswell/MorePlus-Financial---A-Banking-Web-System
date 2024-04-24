import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_transfer_funds(client):
    # Authenticate user and get JWT token
    response = client.post('/auth', json={'username': 'Mohammed', 'password': 'password'})
    assert response.status_code == 200
    access_token = response.json['access_token']

    # Prepare test data
    data = {
        "from_user_id": 1,
        "from_account_id": "1DMJZ2PZ9NVD",  # Account ID represented as string
        "to_user_id": 8,
        "to_account_id": "WSVIF8QQ6BF2",  # Account ID represented as string
        "amount": 200
    }

    # Send POST request to transfer funds with JWT token
    response = client.post('/transfer', json=data, headers={'Authorization': f'Bearer {access_token}'})

    # Check response status code
    assert response.status_code == 200
    assert response.json['message'] == 'Funds transferred successfully'

if __name__ == '__main__':
    pytest.main()
