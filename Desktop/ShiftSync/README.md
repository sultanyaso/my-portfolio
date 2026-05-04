# ShiftSync — Full Stack Project

```
ShiftSync/
├── README.md
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── backend/
    ├── server.js
    ├── seed.js
    ├── stats.aggregate.js
    ├── package.json
    ├── .env
    ├── models/
    │   ├── Job.js
    │   └── CrewMember.js
    └── routes/
        ├── jobs.js
        └── crew.js
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Community](https://www.mongodb.com/try/download/community) running locally on port 27017

---

## How to Run

### Step 1 — Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows — open a terminal and run:
mongod

# Linux
sudo systemctl start mongod
```

### Step 2 — Start the Backend
```bash
cd backend
npm install
node seed.js        # optional: loads sample data into MongoDB
node server.js      # starts API server on http://localhost:5000
```

You should see:
```
✓ MongoDB connected
✓ Server running on http://localhost:5000
```

### Step 3 — Open the Frontend
No web server needed — just open the file in your browser:
- Double-click `frontend/index.html`, OR
- Drag it into Chrome / Firefox / Edge

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/jobs | All jobs (populated crew) |
| POST | /api/jobs | Create a new job → 201 |
| PATCH | /api/jobs/:id/status | Advance status one step |
| DELETE | /api/jobs/:id | Delete job |
| POST | /api/jobs/:id/deploy/:crewId | Assign crew to job |
| GET | /api/crew | All crew members |
| POST | /api/crew | Register crew member |
| PATCH | /api/crew/:id/availability | Update availability |
| DELETE | /api/crew/:id | Remove crew member |
| GET | /api/stats | Aggregated dashboard stats |
