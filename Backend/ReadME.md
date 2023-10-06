# LabelSorters Backend Documentation

This is the documentation for the Backend of **LabelSorters** web app, a RESTful API built using the MERN (MongoDB, Express.js, React.js, Node.js) and Firebase (for authentication ) stack. This API provides the backend functionality for the website, including user management and pdf processing and management

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
   - [Cloning the Repository](#cloning-the-repository)
   - [Environment Configuration](#environment-configuration)
   - [Installing Dependencies](#installing-dependencies)
   - [Running the Server](#running-the-server)
3. [API Routes](#api-routes)
   - [Users](#users)
   - [PDF Processing](#PDF-Processing)
4. [POST Routes Format](#POST-Routes-Format)
5. [GET Routes Format](#GET-Routes-Format)
5. [Security Measures](#security-measures)
6. [Error Handling](#error-handling)
7. [Technologies Used](#technologies-used)
8. [Deployed Backend](#deployed-backend)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

### Cloning the Repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/mayank1784/ecom-labels-format.git
```
### Environment Configuration

In the `Backend` directory, make a `.env` file .
Update the variables in `.env` with your specific configuration details.

Here's an example of config.env:

```bash
DB_URL='mongodb://127.0.0.1:27017/pdf_arranger'
JWT_SECRET='your-secret-key'
```

### Installing Dependencies

Navigate to the project directory and install the required dependencies:

```bash
cd ./Backend
npm install
```

### Running the Server

To start the server, use one of the following commands:

- For production:
   ```bash
  npm start
  ```

- For development (with nodemon for automatic server restarts):
  ```bash
  npm run dev
  ```
  By default, the server will run on port 8000. You can access the API at `http://localhost:3000/api`

## API Routes

We provide the following API routes:


### Users

- `GET /api/google-login` : Log in existing user or register a new user.
- `GET /api/getUser` : Get currently logged in user details (requires authentication).

### PDF Processing

- `POST /api/upload` : Upload PDFs to the server's `\public\uploads` directory after merging to one PDF. (requires authentication).
- `GET /api/processedPdfNames` : Get **PDF names** uploaded by the user in last 30 minutes from `\public\uploads` directory after merging to one PDF. (requires authentication).
- `GET /api/process-pdf/:platform/:pdfName` : Sort the given **pdfName**(PDF name to be same as in server's uploads directory) according to **platform** param and send back download link. (requires authentication).


## POST Routes Format

### Upload PDF(s)

- URL: `/api/upload`
- Method: POST
- Authentication: Required
- Request Body: JSON Object


<details>
  <summary>Example Request (cURL)</summary>

```bash
curl -X POST \
  -H "Authorization: Bearer {your_jwt_token}" \
  -F "pdfFiles=@file1.pdf" \
  -F "pdfFiles=@file2.pdf" \
  https://your-api-url.com/api/upload
```

</details>
<details>
  <summary>Example Request (fetch)</summary>

```bash
const formData = new FormData();
for (let i = 0; i < selectedFiles.length; i++) {
    formData.append('pdfFiles', selectedFiles[i]);
}

fetch('https://your-api-url.com/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${your_jwt_token}`
  },
  body: formData
})
  .then(response => response.json())
```

</details>
<details>
  <summary>Example Request (axios)</summary>

  ```bash
  const formData = new FormData();
for (let i = 0; i < selectedFiles.length; i++) {
    formData.append('pdfFiles', selectedFiles[i]);
}

axios.post('https://your-api-url.com/api/upload', formData, {
  headers: {
    'Authorization': `Bearer ${your_jwt_token}`,
    'Content-Type': 'multipart/form-data'
  }
})
  .then(response => console.log(response.data))
  ```

  </details>


**Request Body**
- name (String, required): The user's full name.
- email (String, required): The user's email address.
- password (String, required): The user's password.

*Example Request Body:*

```bash
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

*Response:*

- Success Response (201 Created)

   - message (String): "User registered successfully."
   - data (Object):
      - token (String): A JSON Web Token (JWT) for user authentication.
      - user (Object): The registered user's details, including the `_id`, `name`, and `email`.

*Example Response:*

```bash
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "_id": "5fbb6ea6a12b3456cd2de",
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
  }
}
```

### Log In as an Existing User

- URL: `/api/v1/login`
- Method: POST
- Authentication: Not required
- Request Body: JSON Object

**Request Body**
- email (String, required): The user's registered email address.
- password (String, required): The user's password.

*Example Request Body:*

```bash
{
  "email": "johndoe@example.com",
  "password": "securePassword123"
}
```

*Response:*

- Success Response (200 OK)

   - message (String): "Login successful."
   - data (Object):
      - token (String): A JSON Web Token (JWT) for user authentication.
      - user (Object): The authenticated user's details, including the `_id`, `name`, and `email`.


*Example Response*

```bash
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "_id": "5fbb6ea6a12b3456cd2de",
      "name": "John Doe",
      "email": "johndoe@example.com"
    }
  }
}
```

### Request a Password Reset Link

- **URL:** `/api/v1/password/forgot`
- **Method:** `POST`
- **Authentication:** Not required
- **Request Body:** JSON Object

**Request Body**

- **email** (String, required): The email address associated with the user's account.

*Example Request Body:*

```json
{
  "email": "johndoe@example.com"
}
```

**Response:**

- Success Response (200 OK)

   - **message** (String): "Password reset email sent successfully."
   - **data** (String): A message confirming that a password reset email has been sent to the provided email address.

*Example Response:*

```json
{
  "success": true,
  "message": "Password reset email sent successfully.",
  "data": "Password reset email has been sent to johndoe@example.com"
}
```

**Error Response:**

- 404 Not Found

   - **message** (String): "User not found with this email address."
   - **data** (String): A message indicating that no user account was found with the provided email address.

*Example Error Response:*

```json
{
  "success": false,
  "message": "User not found with this email address.",
  "data": "No user account found with the email address johndoe@example.com"
}
```

### Create a New Product (Admin)

- **URL:** `/api/v1/admin/product/new`
- **Method:** `POST`
- **Authentication:** Required (Admin Role)
- **Request Body:** JSON Object

**Request Body**

- **name** (String, required): The name of the product.
- **description** (String, required): A detailed description of the product.
- **price** (Number, required): The price of the product.
- **category** (String, required): The category to which the product belongs.
- **stock** (Number, required): The available stock quantity of the product.
- **images** (Array of Objects, required): An array of image objects containing `public_id` and `url`.

*Example Request Body:*

```bash
{
  "name": "Example Product",
  "description": "This is an example product description.",
  "price": 49.99,
  "category": "Electronics",
  "stock": 100,
  "images": [
    {
      "public_id": "image1",
      "url": "https://example.com/image1.jpg"
    },
    {
      "public_id": "image2",
      "url": "https://example.com/image2.jpg"
    }
  ]
}
```

**Response:**

- Success Response (201 Created)

   - **message** (String): "Product created successfully."
   - **data** (Object): The newly created product's details, including the `_id`, `name`, `description`, `price`, `category`, `stock`, and `images`.

*Example Response:*

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "5fbb6ea6a12b3456cd2de",
    "name": "Example Product",
    "description": "This is an example product description.",
    "price": 49.99,
    "category": "Electronics",
    "stock": 100,
    "images": [
      {
        "public_id": "image1",
        "url": "https://example.com/image1.jpg"
      },
      {
        "public_id": "image2",
        "url": "https://example.com/image2.jpg"
      }
    ]
  }
}
```

### Place a New Order

- **URL:** `/api/v1/order/new`
- **Method:** `POST`
- **Authentication:** Required (User)
- **Request Body:** JSON Object

**Request Body**

- **shippingInfo** (Object, required): Shipping information.
   - **address** (String, required): The shipping address.
   - **city** (String, required): The city for shipping.
   - **state** (String, required): The state for shipping.
   - **country** (String, required): The country for shipping.
   - **pincode** (Number, required): The postal code for shipping.
   - **phoneNo** (String, required): The contact phone number for shipping.
- **orderItems** (Array of Objects, required): An array of ordered items.
   - **name** (String, required): The name of the product.
   - **price** (Number, required): The price of the product.
   - **quantity** (Number, required): The quantity of the product.
   - **image** (String, required): The URL of the product image.
   - **product** (String, required): The product ID.
- **paymentInfo** (Object, required): Payment information.
   - **id** (String, required): The payment ID.
   - **status** (String, required): The payment status.
- **paidAt** (Date, required): The date and time of payment.
- **itemsPrice** (Number, required): The total price of ordered items.
- **shippingPrice** (Number, required): The shipping price.
- **totalPrice** (Number, required): The total order price.

*Example Request Body:*

```json
{
  "shippingInfo": {
    "address": "123 Main St",
    "city": "Cityville",
    "state": "Stateville",
    "country": "Countryland",
    "pincode": 12345,
    "phoneNo": "123-456-7890"
  },
  "orderItems": [
    {
      "name": "Example Product 1",
      "price": 49.99,
      "quantity": 2,
      "image": "https://example.com/product1.jpg",
      "product": "5fbb6ea6a12b3456cd2de"
    },
    {
      "name": "Example Product 2",
      "price": 29.99,
      "quantity": 1,
      "image": "https://example.com/product2.jpg",
      "product": "5fbb6ea6a12b3456cd2df"
    }
  ],
  "paymentInfo": {
    "id": "payment123",
    "status": "paid"
  },
  "paidAt": "2023-09-30T10:00:00Z",
  "itemsPrice": 129.97,
  "shippingPrice": 10.00,
  "totalPrice": 139.97
}
```

**Response:**

- Success Response (201 Created)

   - **message** (String): "Order placed successfully."
   - **data** (Object): The newly created order's details, including the `_id`, `shippingInfo`, `orderItems`, `paymentInfo`, `paidAt`, `itemsPrice`, `shippingPrice`, and `totalPrice`.

*Example Response:*

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "5fbb6ea6a12b3456cd2df",
    "shippingInfo": {
      "address": "123 Main St",
      "city": "Cityville",
      "state": "Stateville",
      "country": "Countryland",
      "pincode": 12345,
      "phoneNo": "123-456-7890"
    },
    "orderItems": [
      {
        "name": "Example Product 1",
        "price": 49.99,
        "quantity": 2,
        "image": "https://example.com/product1.jpg",
        "product": "5fbb6ea6a12b3456cd2de"
      },
      {
        "name": "Example Product 2",
        "price": 29.99,
        "quantity": 1,
        "image": "https://example.com/product2.jpg",
        "product": "5fbb6ea6a12b3456cd2df"
      }
    ],
    "paymentInfo": {
      "id": "payment123",
      "status": "paid"
    },
    "paidAt": "2023-09-30T10:00:00Z",
    "itemsPrice": 129.97,
    "shippingPrice": 10.00,
    "totalPrice": 139.97
  }
}
```

## Security Measures

- User authentication using JWT (JSON Web Tokens).
- Firebase Google OAuth used for registering user.
- Retrieval of **sessionToken** in authenticated API request.

## Error Handling

The backend handles errors gracefully and provides clear error messages when endpoints encounter issues.
Error responses include status codes and informative error messages.

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) for authentication
- FireBase OAuth

## Deployed Backend

The backend is not yet deployed.


To access the API routes when cloned locally, you can use tools like [Postman](https://www.postman.com/) or make `HTTP` requests from your frontend application by running the server.

If you have any questions or need further assistance, please don't hesitate to reach out.

**Note**: This documentation assumes you have basic knowledge of RESTful APIs and how to make HTTP requests.
