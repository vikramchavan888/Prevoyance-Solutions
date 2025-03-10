# React-Node-MySQL Authentication & Bulk Upload

This project is a full-stack application featuring user authentication (registration, login, protected routes) and an Admin dashboard. In addition, it includes a bulk data upload functionality using Excel files. The bulk upload feature reads user data (including profile picture URLs) from an Excel file and inserts it into a MySQL database.

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
- [MySQL](https://www.mysql.com/) or compatible database
- npm or yarn

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vikramchavan888/Prevoyance-Solutions.git
   

Install  Backend dependencies (as specified in package.json):

- bcrypt: For hashing passwords.
- cors: To enable Cross-Origin Resource Sharing.
- dotenv: To load environment variables from a .env file.
- express: The web framework.
- jsonwebtoken: For JWT-based authentication.
- multer: For handling file uploads.
- mysql2: MySQL client for Node.js.
- nodemon: For automatic server restarts during development.
- react-toastify: For showing toast notifications (used in the frontend, but installed here if shared).
- xlsx: For reading and parsing Excel files.



Install Frontend dependencies (as specified in package.json):

- react and react-dom: Core React libraries.
- react-router-dom: For routing.
- axios: For making HTTP requests.
- react-toastify: For toast notifications.
- tailwindcss, postcss, autoprefixer: For styling with Tailwind CSS.
- vite: The build tool and development server.



Create a .env file in the server folder (if not already present) and set the required environment variables. For example:

-PORT=3000
-JWT_KEY=your_secret_key
-DB_HOST=localhost
-DB_USER=root
-DB_PASSWORD=your_db_password
-DB_NAME=your_database_name



### Database Schema

Run the following SQL command to create the `users` table in your database:

sql
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

### Database Schema

### **1. Home Page**
![Home Page](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634265/Screenshot_258_fufgef.png)

### **2. Admin Dashboard**
![Admin Dashboard](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634266/Screenshot_263_oeoiky.png)

### **2. Add User**
![Admin Dashboard](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634921/Screenshot_269_ltpzsv.png)

### **3. SignIn/SignUp**
![SignIn](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634266/Screenshot_260_bwbmsh.png)
![SignUp](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634265/Screenshot_259_nwbyfg.png)

### **1. Excel Upload**
![PopUp](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634266/Screenshot_264_ctgt1t.png)

### **1. Profile Page**
![Profile Page](https://res.cloudinary.com/dlwpgtmcn/image/upload/v1741634267/Screenshot_268_vdojeo.png)
