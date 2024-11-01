# 📝 Blog Application

Welcome to the **Blog Application**! This full-stack MERN application allows users to create, view, edit, and delete blog posts. Featuring modern design and easy-to-use navigation, it’s a complete platform for sharing thoughts and ideas.

## 🌟 Features

- **User Authentication**: Sign up, log in, and secure access for users.
- **CRUD Operations**: Create, read, update, and delete blog posts effortlessly.
- **Rich Text Editor**: Write blog posts with styled text, images, and links.
- **Responsive Design**: Optimized for desktop and mobile views.
- **Dashboard**: Manage posts, view analytics, and customize settings.

## 🛠️ Tech Stack

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (backend), Netlify (frontend)

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MohamedBoghdaddy/Blog.git
   cd Blog
   ```

2. **Install dependencies for backend**:
   ```bash
   cd server
   npm install
   ```

3. **Install dependencies for frontend**:
   ```bash
   cd ../client
   npm install
   ```

4. **Create environment variables**:
   - In the `server` directory, create a `.env` file and add:
     ```bash
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

### Run the Application

1. **Start the backend server**:
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend**:
   ```bash
   cd client
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 📂 Project Structure

```plaintext
Blog/
├── client/        # React frontend
├── server/        # Node.js backend
└── README.md      # Project documentation
```

## 📜 License

This project is licensed under the MIT License.
