import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from dotenv import load_dotenv
import secrets
import string

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['banking-api']
users_collection = db['users']

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize JWTManager with the loaded secret key
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Authentication endpoint
@app.route('/auth', methods=['POST'])
def authenticate_user():
    data = request.json

    # Retrieve username and password from environment variables
    username = os.getenv('USERNAME')
    password = os.getenv('PASSWORD')
    
    # Log the loaded environment variables
    print("Loaded USERNAME:", username)
    print("Loaded PASSWORD:", password)
    
    # Check if 'username' and 'password' keys are in the request data
    if 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400

    # Check if username and password are correct
    if data['username'] == username and data['password'] == password:
        # Create access token for the user
        access_token = create_access_token(identity=data['username'])
        return jsonify(access_token=access_token), 200
    else:
        # Return error if username or password is incorrect
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/users', methods=['GET'])
def get_users():
    users = list(users_collection.find({}, {'_id': 0}))
    return jsonify(users)

@app.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    data = request.json
    
    if 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Missing parameters: name or email'}), 400

    # Check if the document already exists
    existing_document = users_collection.find_one({})
    if existing_document:
        # Get the count of existing users
        user_count = len(existing_document['users'])
    else:
        user_count = 0
    
    # Generate new _id for the user
    new_id = user_count + 1
    
    # Create new user data
    new_user_data = {
        "_id": new_id,
        "name": data['name'],
        "email": data['email'],
        "accounts": []
    }

    # Update the existing document by adding the new user to the 'users' array
    update_result = users_collection.update_one({}, {"$push": {"users": new_user_data}})
    
    if update_result.modified_count > 0:
        # Return the user data including the generated _id
        return jsonify({'message': 'User created successfully', 'user_id': new_id, 'user_data': new_user_data}), 201
    else:
        return jsonify({'error': 'Failed to add user'}), 500

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'error': 'Invalid user ID format'}), 400
    
    user = users_collection.find_one({"users._id": user_id}, {'_id': 0, 'users.$': 1})
    if user:
        return jsonify(user)
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'error': 'Invalid user ID format'}), 400

    # Find the user with the specified user_id
    user = users_collection.find_one({"users._id": user_id}, {'_id': 0, 'users.$': 1})

    if user:
        # Remove the user from the 'users' array using $pull
        users_collection.update_one({}, {"$pull": {"users": {"_id": user_id}}})
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<user_id>/accounts', methods=['GET'])
def get_user_accounts(user_id):
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'error': 'Invalid user ID format'}), 400

    user = users_collection.find_one({"users._id": user_id}, {'_id': 0, 'users.$': 1})
    if user:
        accounts = user['users'][0]['accounts']
        return jsonify(accounts)
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<int:user_id>/accounts', methods=['POST'])
@jwt_required()
def add_account(user_id):
    data = request.json

    # Check if request body contains 'type' and 'balance'
    if not data or 'type' not in data or 'balance' not in data:
        return jsonify({'error': 'Invalid account data. Ensure "type" and "balance" are provided.'}), 400
    
    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'error': 'Invalid user ID format'}), 400

    # Find the user with the specified user_id
    user = users_collection.find_one({"users._id": user_id}, {'_id': 0, 'users.$': 1})

    if not user:
        # User not found, handle this case appropriately (e.g., return an error response)
        return jsonify({'error': 'User not found'}), 404

    # Get the accounts array from the user document or create an empty one if it doesn't exist
    accounts = user.get('accounts', [])
    
    # Define characters to use for generating the ID
    characters = string.ascii_uppercase + string.digits

    # Generate a 12-character alphanumeric ID
    new_id = ''.join(secrets.choice(characters) for _ in range(12))

    # Add the new account to the accounts array with the generated ID
    new_account = {
        "_id": new_id,
        "type": data['type'],
        "balance": data['balance']
    }
    accounts.append(new_account)

    """new_account = {
        "_id": max(account.get('_id', 0) for account in accounts) + 1 if accounts else 1,
        "type": data['type'],
        "balance": data['balance']
    }"""

    # Update the user document with the modified accounts array
    users_collection.update_one({"users._id": user_id}, {"$set": {"users.$.accounts": accounts}}, upsert=True)

    return jsonify({'message': 'Account added successfully', 'account': new_account}), 201

@app.route('/transfer', methods=['POST'])
@jwt_required()
def transfer_funds():
    data = request.json

    # Check if request body contains required fields
    required_fields = ['from_user_id', 'from_account_id', 'to_user_id', 'to_account_id', 'amount']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Invalid transfer data. Ensure all required fields are provided.'}), 400

    try:
        from_user_id = int(data['from_user_id'])
        from_account_id = str(data['from_account_id'])
        to_user_id = int(data['to_user_id'])
        to_account_id = str(data['to_account_id'])
        amount = float(data['amount'])
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid data format'}), 400

    # Find the source and destination users with the specified accounts
    from_user = users_collection.find_one({"users._id": from_user_id, "users.accounts._id": from_account_id},
                                           {'_id': 0, 'users.$': 1})
    to_user = users_collection.find_one({"users._id": to_user_id, "users.accounts._id": to_account_id},
                                         {'_id': 0, 'users.$': 1})

    if not from_user or not to_user:
        return jsonify({'error': 'One or both accounts not found'}), 404

    from_account = next((acc for acc in from_user['users'][0]['accounts'] if acc['_id'] == from_account_id), None)
    to_account = next((acc for acc in to_user['users'][0]['accounts'] if acc['_id'] == to_account_id), None)

    if not from_account or not to_account:
        return jsonify({'error': 'One or both accounts not found'}), 404

    if from_user_id == to_user_id and from_account_id == to_account_id:
        return jsonify({'error': 'Cannot transfer funds to the same account'}), 400

    if from_account['balance'] < amount:
        return jsonify({'error': 'Insufficient funds'}), 400

    # Update account balances
    from_account['balance'] -= amount
    to_account['balance'] += amount

    # Update the user documents with the modified account balances
    users_collection.update_one(
        {"users._id": from_user_id},
        {"$set": {"users.$[elem].accounts.$[acc].balance": from_account['balance']}},
        array_filters=[{"elem._id": from_user_id}, {"acc._id": from_account_id}],
        upsert=True
    )
    users_collection.update_one(
        {"users._id": to_user_id},
        {"$set": {"users.$[elem].accounts.$[acc].balance": to_account['balance']}},
        array_filters=[{"elem._id": to_user_id}, {"acc._id": to_account_id}],
        upsert=True
    )

    return jsonify({'message': 'Funds transferred successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)