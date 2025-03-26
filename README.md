# 🛍️ Product Management App

A full-stack CRUD web application built with **Node.js**, **Express**, and **MongoDB**, featuring a dynamic front-end interface for managing product listings.

## ✨ Features

- Create, read, update, and delete products
- Pagination support with customizable `perPage`
- Real-time form validation and error handling
- Modal confirmation for deletions
- Responsive front-end with Bootstrap
- Spinner animations during API calls

## 🧩 Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Validation:** express-validator
- **Logging:** Winston
- **Tooling:** Nodemon, Git, Postman

## 📁 Folder Structure

```
inft-2202-lab/
├── client/             # Front-end HTML/CSS/JS
├── src/
│   └── server/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── public/             # Static assets
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/andreasevansadamecz/product-management-app.git
cd product-management-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
npm run dev
```

The server will be running on [http://localhost:3000](http://localhost:3000)

### 4. Open the app

Open `client/index.html` or `search.html` in your browser to use the front-end interface.

## ✅ Assignment Requirements Covered

- Local Express API with full CRUD routes
- Modular controllers with validation and error handling
- Product form with live validation and feedback
- Front-end fully decoupled from the course API
- Spinner animation on all API calls
- Fully working pagination and product editing

---

## 📬 Contact

Built by **Andreas Evans-Adamecz**  
📫 [andreasevansadamecz1@gmail.com](mailto:andreasevansadamecz1@gmail.com)
