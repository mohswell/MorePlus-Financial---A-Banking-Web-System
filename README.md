# MorePlus Financial - Banking Web System REST API 💳

This project is a RESTful API for the MorePlus Financial Banking Web System. It provides endpoints for user authentication, user management, account management, and funds transfer functionality. The API is secured using JWT (JSON Web Tokens) for authentication and authorization. 🚀

## Features 🛠️

- **User Authentication**: Provides an endpoint for authenticating users and generating JWT tokens.
- **User Management**: Allows users to be created and retrieved from the database.
- **Account Management**: Supports the creation of new accounts and retrieval of account information.
- **Funds Transfer**: Enables users to transfer funds between accounts.
- **Testing Features**: Includes pytest files for testing the application endpoints and database interactions.

## Technologies Used 🤖

- **Flask**: A lightweight WSGI web application framework in Python.
- **MongoDB**: A NoSQL document database used for storing user and account information.
- **Flask JWT Extended**: An extension for Flask that adds JWT support to the application.
- **Python**: The programming language used to develop the API.
- **pytest**: A testing framework for Python used for writing and running tests.

## Installation and Setup ⚙️

1. Clone the repository:

   ```bash
   git clone https://github.com/Moddic10/MorePlus-Financial---A-Banking-Web-System.git
   ```

2. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory of the project and add the following variables:

   ```plaintext
   JWT_SECRET_KEY=your_jwt_secret_key_here
   USERNAME=your_username_here
   PASSWORD=your_password_here
   ```

4. Run the application:

   ```bash
   python app.py
   ```

## Testing 🧪

The project includes pytest files for testing the application endpoints and database interactions. To run the tests, use the following command:

```bash
pytest
```

## API Documentation 📖

For detailed documentation on the API endpoints and how to use them, refer to the API documentation provided in the `docs` folder in the main branch.

## Contributors 👨‍💻

- Muhammad Said

## License 📝

This project is licensed under the MohsLaw License - see the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to this project by submitting pull requests or reporting any issues. Thank you for using MorePlus Financial Banking Web System REST API! 🙌

For inquiries or support, feel free to contact Muhammad Said:
- Email: mohammedabdy10@gmail.com
- LinkedIn: [Muhammad Said](www.linkedin.com/in/muhammad-said-124219231)
- GitHub: [Moddic10](https://github.com/Moddic10)
