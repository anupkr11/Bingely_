# 🎬 Bingely - MERN Entertainment Web App

Bingely is a modern, responsive entertainment web application built with the MERN stack. It allows users to browse movies and TV series, search for their favorite content, and maintain a personalized bookmark library.


## ✨ Features

- 🔐 **User Authentication**: Secure Signup and Login using JWT and Bcrypt.
- 🏠 **Home Page**: Trending movies and TV series at a glance.
- 🎬 **Movies & TV Series**: Dedicated sections for specific content types.
- 🔍 **Real-time Search**: Search across movies and series instantly.
- 🔖 **Bookmarking**: Save your favorite content to your personal library (Requires Login).
- 📱 **Fully Responsive**: Optimized for Desktop, Tablet, and Mobile.
- 🎨 **Premium UI**: Built with Tailwind CSS v4 and Framer Motion for smooth animations.

## 🚀 Tech Stack

### Frontend
- **React 19** (Vite)
- **Redux Toolkit** (State Management)
- **Tailwind CSS v4** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **React Router Dom** (Navigation)
- **Axios** (API Requests)

### Backend
- **Node.js** & **Express**
- **MongoDB** (Mongoose ODM)
- **JSON Web Tokens (JWT)** (Auth)
- **BcryptJS** (Password Hashing)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Bingely.git
cd Bingely
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```
Run the frontend:
```bash
npm run dev
```

---

## 🌐 Deployment

### Backend
The backend is ready to be deployed on platforms like **Render** or **Heroku**.
- Ensure `MONGO_URI` and `JWT_SECRET` are set in the environment variables.

### Frontend
The frontend can be deployed on **Vercel** or **Netlify**.
- Set `VITE_API_BASE_URL` to your production backend URL.

---

## Deployed Links
Frontend - https://bingely.vercel.app/
Backend - https://bingely-backend.onrender.com/

### Note- General
1. GET /
Purpose: Displays the welcome message.
Access: Public

### Authentication Routes (/api/auth)
1. POST /api/auth/register
Purpose: Registers a new user.
Body: firstName, lastName, email, password.
Access: Public
2. POST /api/auth/login
Purpose: Logs in a user and returns a JSON Web Token (JWT).
Body: email, password.
Access: Public

### Bookmark Routes (/api/bookmarks)
(Note: These require an Authorization: Bearer <token> header)
1. GET /api/bookmarks
Purpose: Fetches all bookmarks for the currently authenticated user.
Access: Private
2. POST /api/bookmarks/toggle
Purpose: Adds a movie/TV series to the user's bookmarks, or removes it if it's already there.
Body: tmdbId, title, type, posterPath, year, rating.
Access: Private

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---

Developed with ❤️ by [Anup](https://github.com/anupkr11)
