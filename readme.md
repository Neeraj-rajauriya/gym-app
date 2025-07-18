💪 Gym Management Web Application – Full Stack Project
A fully-featured fitness management SaaS platform that empowers users to access workouts, diets, and progress tracking — while giving Admins and Trainers tools to manage operations efficiently. The platform is built using MERN stack with secure authentication, role-based access, and Dockerized deployment.

🔗 Live Site: https://gymapp-frontend-1k6e.onrender.com
🐳 Docker Hub: https://hub.docker.com/repositories/neerajrajauriya
📦 Backend Repo: GitHub - Backend

🚀 Tech Stack
⚙️ Backend
Node.js + Express.js

MongoDB + Mongoose

JWT + BcryptJS (secure authentication)

CORS, .env for API security

Multer (file uploads for progress tracking)

Docker for containerized deployment

Morgan (logging)

🎨 Frontend
Next.js (App Router + Tailwind CSS)

Axios, React Toastify, React Hook Form

JWT decoding and role-based routing

Fully responsive UI

Dockerized deployment

🧩 Core Features
✅ Authentication
User Registration & Login

Secure JWT Token-based login

Role-based dashboard: User / Trainer / Admin

💳 Membership
Users can view and purchase plans (Basic, Elite, Pro)

Admin can Add/Edit/Delete membership plans

🏋️ Workout
Trainers/Admins can create & assign workouts

Users can view personalized workout routines

🥗 Diet Plan
Trainers/Admins can create & assign diet plans

Users can view goal-based diet schedules

📅 Booking Trainer
Users can book trainer sessions

Trainers view and manage their bookings

📈 Progress Tracker
Users can upload weight, body fat %, notes, and images

Trainers can view assigned users' fitness progress

📊 Admin Dashboard
View all users and trainers

Admin can delete/update user accounts

Stats with charts for total users, bookings, revenue

📁 Folder Structure
Backend – backend/
bash
Copy
Edit
backend/
├── src/
│   ├── config/           # DB config
│   ├── controllers/      # API logic (auth, users, plans, etc.)
│   ├── middleware/       # Auth, role checks, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route files
│   ├── utils/            # Helper functions (e.g., token generation)
│   └── uploads/          # User progress image uploads
├── .env                  # Environment variables
├── Dockerfile            # Docker support
└── app.js                # Main entry point
Frontend – frontend/
bash
Copy
Edit
frontend/
├── src/
│   ├── app/
│   │   ├── auth/             # Login, Register pages
│   │   ├── booking/          # Book trainer
│   │   ├── diet/             # Diet plans
│   │   ├── membership/       # Membership UI
│   │   ├── payment/          # Payment (optional)
│   │   ├── progress/         # Progress Tracker
│   │   ├── users/            # Admin user management
│   │   ├── workout/          # Workout pages
│   │   ├── layout.js         # Layout
│   │   └── page.js           # Home page
│   ├── styles/               # Tailwind / global styles
│   └── utils/                # JWT decode, route protection
├── Dockerfile
├── .env.local
├── tailwind.config.js
└── package.json
🔒 Security & Middleware
JWT Authentication: Token verification and role-based access control

Environment Config: All secrets/keys are stored securely in .env

CORS Protection: CORS middleware for cross-origin security

Dockerized Backend & Frontend: Fully production-ready using Docker

🐳 Docker Deployment
Docker Hub: https://hub.docker.com/repositories/neerajrajauriya

Run Locally with Docker
bash
Copy
Edit
# Clone the repo
git clone https://github.com/Neeraj-rajauriya/gym-app.git
cd gym-app

# Build Docker images
docker build -t gymapp-backend ./backend
docker build -t gymapp-frontend ./frontend

# Run containers
docker run -p 5000:5000 gymapp-backend
docker run -p 3000:3000 gymapp-frontend
📦 Installation Without Docker
Backend
bash
Copy
Edit
cd backend
npm install
# Create .env and configure DB_URI, JWT_SECRET, etc.
npm run dev
Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
✅ Roadmap Phases (Frontend + Backend)
Phase	Module	Status
0	Setup (Docker + Base Code)	✅
1	Authentication	✅
2	Dashboard & Role Routing	✅
3	Membership	✅
4	Workout Programs	✅
5	Diet Plans	✅
6	Book Trainer	✅
7	Progress Tracker	✅
8	Admin Panel & Stats	✅
9	Notifications (Toast Only)	✅

🔧 API Security
All protected routes use authMiddleware and roleMiddleware

Token verification is done using JWT

.env file holds secret keys securely

CORS enabled to restrict unwanted external access

🧠 Suggestions for Future
Add Razorpay/Stripe integration for real payment

Enable SMS Notifications using Twilio

Add unit tests for backend APIs

Docker Compose for combined multi-container app

👤 Author
Neeraj Rajauriya
📧 neerajrrajauriya123@gmail.com
🌐 GitHub | LinkedIn