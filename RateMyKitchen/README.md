# RateMyKitchen

A glassmorphism-styled web application for monitoring kitchen hygiene using AI.

## Project Structure
- `backend/`: Node.js + Express + SQLite + YOLOv8 Integration
- `frontend/`: React + Vite + Bootstrap 5 + Glassmorphism CSS

## Setup Instructions

### Backend
1. Navigate to `backend` directory.
2. Install dependencies: `npm install`
3. Start the server: `npm start`
   - Runs on `http://localhost:5000`
   - Database: `database.sqlite` (Created automatically)

### Frontend
1. Navigate to `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
   - Access at `http://localhost:5173`

## AI Integration
- Place your YOLOv8 model (`best.pt`) in `backend/yolo_model/`.
- Upload CCTV videos to `backend/uploads/cctv_feeds/<hotel_id>/video.mp4`.
- The system will automatically scan these videos in the background.

## Users
- **Admin**: Register via API or seeding (Endpoint: `/api/auth/register-admin`)
- **Hotel**: Register via UI, await Admin approval.
