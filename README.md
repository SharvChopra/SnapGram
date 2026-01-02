# SnapGram - Full Stack Social Media Application

SnapGram is a fully functional social media application inspired by Instagram, built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern UI/UX, real-time messaging, media sharing (Posts, Stories, Reels), and social discovery.

## 🚀 Features

### Core
-   **Authentication**: Secure Signup/Login with JWT, password hashing (bcrypt), and rate limiting.
-   **User Profiles**: Bio, links, profile photo, and public/private account toggles.
-   **Social Graph**: Follow/Unfollow system, private account requests (Accept/Reject), and blocking.

### Content
-   **Posts**: Upload photos with captions, location, and auto-generated hashtags.
-   **Stories**: 24-hour disappearing photo/video updates with viewer tracking.
-   **Reels**: Short-form vertical video feed with snap-scrolling and auto-play.
-   **Feed**: Infinite scrolling home feed mixed with suggestions.
-   **Explore**: Discovery grid for trending content and new creators.

### Interaction
-   **Real-Time Messaging**: Instant one-on-one chat using Socket.io.
-   **Likes & Comments**: Interactive engagement on posts and reels.
-   **Search & Discovery**: Find users or browse trending hashtags.

## 🛠 Tech Stack

-   **Frontend**: React.js, TailwindCSS, Lucide Icons, Socket.io-client, Axios.
-   **Backend**: Node.js, Express.js, Socket.io, Mongoose.
-   **Database**: MongoDB.
-   **Storage**: Cloudinary (for images/videos).

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js installed
-   MongoDB installed or Atlas URI
-   Cloudinary Account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd instagram-clone
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📱 Implementation Details

-   **Socket.io**: Used for real-time chat updates. The `SocketContext` in the frontend ensures a persistent connection.
-   **Infinite Scroll**: Custom `useInfiniteScroll` hook utilizing `IntersectionObserver` for performant feed rendering.
-   **TTL Index**: MongoDB Time-To-Live index used for automatically deleting Stories after 24 hours.

## 🤝 Contribution

Feel free to fork this repository and submit pull requests for new features or bug fixes.

---
Built with ❤️ using the MERN Stack.
