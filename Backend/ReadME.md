# Backend API Routes

## User Routes
- **POST** - `/api/google-login` : Post request to login user using firebase Oauth google provider.
  Response
  ```json
  { "sessionToken" }
  ```
- **GET** - `/api/getUser` : Get The current user info
  ```json
  {
    "uid": "User's firebase id",
    "email": "abc@de.com",
    "displayName": "John Smith",
    "photoURL": "https://adqwda/sff"
  }
  ```
 
