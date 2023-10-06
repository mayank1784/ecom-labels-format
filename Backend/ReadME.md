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

### Request

**Headers:**

- Authorization (String, Required): A JSON Web Token (JWT) for user authentication.
- Content-Type (String, Required): Set to multipart/form-data to correctly handle file uploads.

- *Body:*

   - pdfFiles (File, Required): An array of PDF files to be uploaded. Maximum files 20 in a single request.

*Example Request:*

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

### Response:

- **Success Response (201 Created)**

   - `message (String):` "PDF uploaded successfully."
   - `pdfName (String):` The server side name of the uploaded PDF file.

*Example Response:*

```json
{
  "message": "PDF uploaded successfully",
  "pdfName": "user12345_merged_1633687423764.pdf"
}
```

- **Error Response (400 Bad Request):**
  
  - `message (String):` "No PDF files uploaded." (If no files are provided in the request)

*Example Error Response:*

```json
{
  "message": "No PDF files uploaded"
}
```

- **Error Response (401 Unauthorized):**
  
  - `message (String):` "Unauthorized" (If the provided JWT token is invalid or missing).

*Example Error Response:*

```json
{
  "message": "Unauthorized"
}
```

- **Error Response (500 Internal Server Error):**
  
  - `message (String):`  "Error merging and saving PDFs" (If there is an internal server error during the upload process).

*Example Error Response:*

```json
{
  "message": "Error merging and saving PDFs"
}
```

## GET Routes Format

### Get User Details

- URL: `/api/getUser`
- Method: GET
- Authentication: Required

### Request

**Headers:**

- Authorization (String, Required): A JSON Web Token (JWT) for user authentication.


*Example Request:*

<details>
  <summary>Example Request (cURL)</summary>

```bash
curl -X GET \
  -H "Authorization: Bearer {your_jwt_token}" \
  https://your-api-url.com/api/getUser
```

</details>
<details>
  <summary>Example Request (fetch)</summary>

```bash
fetch('https://your-api-url.com/api/getUser', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${your_jwt_token}`
  }
})
  .then(response => response.json())
```

</details>
<details>
  <summary>Example Request (axios)</summary>

  ```bash
axios.get('https://your-api-url.com/api/getUser', {
  headers: {
    'Authorization': `Bearer ${your_jwt_token}`
  }
})
  .then(response => console.log(response.data))
  ```

  </details>

### Response:

- **Success Response (200 OK)**

   - `message (String):` "User details retrieved successfully."
   - `data (Object):` The user's details, including  `_id`, `uid`, `email`, `displayName`, `photoURL`.

*Example Response:*

```json
{
  "message": "User details retrieved successfully",
  "data": {
    "_id": "5fbb6ea6a12b3456cd2de",
    "uid": "EWrIZH9ecLNBGYFCXw28h6afwcSr2",
    "email": "johndoe@example.com",
    "displayName": "John Doe",
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIPeQzGxz5o3f4EjC6rIxWPdWPrGYFctd2ztx1mfw=s96-c"
  }
}
```

- **Error Response (401 Unauthorized):**
  
  - `message (String):` "Unauthorized" (If the provided JWT token is invalid or missing).

*Example Error Response:*

```json
{
  "message": "Unauthorized"
}
```

- **Error Response (404 Not Found):**
  
  - `message (String):`  "User not found" (If the user does not exist).

*Example Error Response:*

```json
{
  "message": "User not found"
}
```

### Get PDF Names

- URL: `/api/processedPdfNames`
- Method: GET
- Authentication: Required

### Request

**Headers:**

- Authorization (String, Required): A JSON Web Token (JWT) for user authentication.


*Example Request:*

<details>
  <summary>Example Request (cURL)</summary>

```bash
curl -X GET \
  -H "Authorization: Bearer {your_jwt_token}" \
  https://your-api-url.com/api/processedPdfNames
```

</details>
<details>
  <summary>Example Request (fetch)</summary>

```bash
fetch('https://your-api-url.com/api/processedPdfNames', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${your_jwt_token}`
  }
})
  .then(response => response.json())
```

</details>
<details>
  <summary>Example Request (axios)</summary>

  ```bash
axios.get('https://your-api-url.com/api/processedPdfNames', {
  headers: {
    'Authorization': `Bearer ${your_jwt_token}`
  }
})
  .then(response => console.log(response.data))
  ```

  </details>

### Response:

- **Success Response (200 OK)**

   - `message (String):` "PDF names retrieved successfully."
   - `data (Array of Strings):` An array of PDF file names uploaded by the user in the last 30 minutes.

*Example Response:*

```json
{
  "message": "PDF names retrieved successfully",
  "data": [
    "user12345_merged_1633687423764.pdf",
    "user12345_merged_1633687423765.pdf"
  ]
}
```

- **Error Response (401 Unauthorized):**
  
  - `message (String):` "Unauthorized" (If the provided JWT token is invalid or missing).

*Example Error Response:*

```json
{
  "message": "Unauthorized"
}
```

- **Error Response (500 Internal Server Error):**
  
  - `message (String):` "Error fetching files" (If there is an internal server error during the process).

*Example Error Response:*

```json
{
  "message": "Error fetching files"
}
```

### Process PDF

- URL: `/api/process-pdf/:platform/:pdfName`
- Method: GET
- Authentication: Required

**Description**
This endpoint processes a PDF file based on the provided platform and initiates an automatic download of the processed PDF file.
If the processed file already exists, it is sent for download with appropriate headers. If not, the PDF is processed, sorted,
and the sorted file is sent for download.

**Parameters**
- `platform` (String, Required): The platform to be used for sorting the PDF (e.g., "amazon" or "other").
- `pdfName` (String, Required): The name of the PDF file to be sorted (PDF name should match the one in the server's uploads directory).

### Request

**Headers:**

- Authorization (String, Required): A JSON Web Token (JWT) for user authentication.


*Example Request:*

```bash
https://your-api-url.com/api/process-pdf/amazon/user12345_merged_1633687423764.pdf
```

### Response:

- **Success Response (File Download)**

  - The response contains the processed PDF file for automatic download.
  - `Content-Disposition:` Attachment header to initiate automatic download.
  - `Content-Type:` The file type of the downloaded PDF.

*Example Response Headers:*

```bash
Content-Disposition: attachment; filename=processed.pdf
Content-Type: application/pdf
```


- **Error Response (401 Unauthorized):**
  
  - `message (String):` "Unauthorized" (If the provided JWT token is invalid or missing).

*Example Error Response:*

```json
{
  "message": "Unauthorized"
}
```

- **Error Response (404 Not Found):**
  
  - `message (String):` "Processed PDF not found" (If the processed PDF file does not exist).

*Example Error Response:*

```json
{
  "message": "Processed PDF not found"
}
```


- **Error Response (500 Internal Server Error):**
  
  - `message (String):` "Error processing PDF" (If there is an internal server error during the process).

*Example Error Response:*

```json
{
  "message": "Error processing PDF"
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
