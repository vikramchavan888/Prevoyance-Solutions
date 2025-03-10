

This project is a full-stack application featuring user authentication (registration, login, protected routes) and an Admin dashboard. Additionally, it includes a bulk data upload functionality using Excel files. The bulk upload feature reads user data (including profile picture URLs) from an Excel file and inserts it into a MySQL database.

## Features

- **User Registration & Login**
  - Registration supports uploading a profile picture (stored locally).
  - Login uses JWT-based authentication.
- **Protected Routes**
  - Users have a dashboard where their details are retrieved based on their token.
  - Admin dashboard displays all users and supports inline editing, updating, and deleting.
- **Bulk Data Upload**
  - Admins can upload an Excel file (stored in the `uploads/excel` folder).
  - The Excel file is parsed using the `xlsx` library.
  - User data is extracted and inserted into the MySQL database.
  - The profile picture column in Excel stores a URL, which is directly saved in the database.
- **Static File Serving**
  - Local profile images are served from the `uploads/` folder.

## Tech Stack

- **Backend:** Node.js, Express, MySQL, JWT, Multer, XLSX, bcrypt
- **Frontend:** React, React Router, Axios, React Toastify, Tailwind CSS

## Prerequisites

- [Node.js](https://nodejs.org/) (v12+)
- [MySQL](https://www.mysql.com/) or a compatible database
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vikramchavan888/Prevoyance-Solutions.git
2. Backend Setup
Install backend dependencies as specified in package.json:

bash
Copy
Edit
npm install
Dependencies Used:
bcrypt: For hashing passwords.
cors: To enable Cross-Origin Resource Sharing.
dotenv: To load environment variables from a .env file.
express: The web framework.
jsonwebtoken: For JWT-based authentication.
multer: For handling file uploads.
mysql2: MySQL client for Node.js.
nodemon: For automatic server restarts during development.
xlsx: For reading and parsing Excel files.
3. Frontend Setup
Navigate to the frontend directory and install dependencies:

bash
Copy
Edit
npm install
Dependencies Used:
react and react-dom: Core React libraries.
react-router-dom: For routing.
axios: For making HTTP requests.
react-toastify: For toast notifications.
tailwindcss, postcss, autoprefixer: For styling with Tailwind CSS.
vite: The build tool and development server.
4. Environment Variables
Create a .env file in the server directory and set the required environment variables:

env
Copy
Edit
PORT=3000
JWT_KEY=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
5. Database Schema
Run the following SQL command to create the users table in your database:

sql
Copy
Edit
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  mobile VARCHAR(15),
  address TEXT,
  profile_picture VARCHAR(255)
);
6. Start the Application
Backend: Run the following command in the server directory:

bash
Copy
Edit
npm start
or for development with auto-restarts:

bash
Copy
Edit
nodemon
Frontend: Run the following command in the frontend directory:

bash
Copy
Edit
npm run dev
Access the app in your browser at http://localhost:3000.

Screenshots
1. Home Page


2. Admin Dashboard


3. Add User


4. Sign In/Sign Up


5. Excel Upload


6. Profile Page


