# 📱 Social Media Friend Recommendation App

A **full-stack MERN (MongoDB, Express.js, React.js, Node.js) social media application** that allows users to **search for friends, send friend requests, manage their friend list, and receive friend recommendations based on mutual connections**.

## **🌍 Live Deployment**
- **Frontend (Vercel):** | **[🔗Social App](https://social-tutedude.vercel.app/)**
- **Backend (Render):** | **[🔗API Server](https://social-media-app-vwdh.onrender.com)** 
---
## **📌 Features**
### **🔹 Authentication**
✅ **User Signup & Login** (JWT authentication)  
✅ **Persistent User Sessions**  

### **🔹 Home Page**
✅ **Displays all registered users**  
✅ **Search functionality for users**  
✅ **Friend requests & mutual friend suggestions**  

### **🔹 Friend Management**
✅ **Send & Accept Friend Requests**  
✅ **Reject Friend Requests**  
✅ **Unfriend Existing Friends**  

### **🔹 Friend Recommendation System**
✅ **Suggests friends based on mutual connections**  
✅ **Displays total number of mutual friends**  

### **🔹 User Interface**
✅ **Bootstrap-based responsive UI**  
✅ **Clean & intuitive design**  

---

## **🚀 Tech Stack**
### **Frontend (React)**
- React.js
- React Bootstrap
- React Router
- React Toastify (for notifications)
- Context API (Auth management)

### **Backend (Node.js + Express)**
- Node.js
- Express.js
- JWT Authentication
- MongoDB (Mongoose)

### **Deployment**
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** MongoDB Atlas  

---

## **⚙️ Installation & Setup**
### **🔹 1. Clone the Repository**
```sh
git clone https://github.com/your-username/social-media-app.git
cd social-media-app
```

---

### **🔹 2. Backend Setup**
```sh
cd backend
npm install
```
#### **Configure `.env` in `/backend`**
```sh
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```
#### **Run the Backend Server**
```sh
npm run dev
```

---

### **🔹 3. Frontend Setup**
```sh
cd frontend
npm install
```
#### **Configure `.env` in `/frontend`**
```sh
REACT_APP_API_URL=http://localhost:5000
```
#### **Run the Frontend Server**
```sh
npm start
```

---

## **📌 API Endpoints**
### **🔹 Auth Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate a user |

### **🔹 Friend Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/friends` | Fetch all friends |
| `POST` | `/api/friends/request` | Send a friend request |
| `POST` | `/api/friends/accept` | Accept a friend request |
| `POST` | `/api/friends/reject` | Reject a friend request |
| `POST` | `/api/friends/remove` | Unfriend a user |

---
## **👨‍💻 Author**
- **Tanmay** | **[GitHub](https://github.com/ChefnCoder)** 
