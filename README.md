# Aria | E-Commerce Blueprint

A modern, production-grade e-commerce full-stack application built over 12 weeks.

## Architecture
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Zustand
- **Backend:** Node.js, Express, MongoDB Atlas, Cloudinary, Resend
- **Cloud/Deployment:** Vercel (Frontend), Render.com (Backend)

## Phase 1 Readiness
- The frontend and backend are successfully scaffolded.
- Tailwind CSS is fully integrated.
- Security enhancements (`helmet.js`, `express-rate-limit`) are present on the backend.

### Important Note on Backend Deployment (Render.com)
The backend is designed to be hosted on Render.com's Free Tier. This tier spins down after 15 minutes of inactivity, causing the first subsequent request to take 30-50 seconds to complete (cold start).
**Workaround:** We provide a `/health` endpoint. You can configure a free uptime monitoring service like **UptimeRobot** to ping `https://[your-backend-url].onrender.com/health` every 10-14 minutes, which prevents the server from spinning down.
