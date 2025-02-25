## LeadGreen - Sustainability Game
Welcome to LeadGreen ! a web application with a Django backend and a React frontend designed to promote sustainable habits through gamification. Users can post their eco-friendly actions, such as recycling, reducing vehicle travel, and saving electricity, by scanning a QR code. Each post earns points that users can spend to grow their virtual plant by watering, fertilizing, and cleaning it. HELP US CREATE CARBON NEUTRAL ENVIORNMENT.

When you complete a sustainable activity such as picking up litter or using public transport, you scan a QR code at that location and post a photo of what you have done. You will then be awarded points based on what the activity was and your photo will be uploaded to the feed where other users can see your activity.

You can then spend these points growing your plant. Using water, soil, etc. As your plant grows it will level up unlocking new appearances.  

---

## GROUP LAKERS

The group members are:

1. Benitas
2. Henry
3. Jed
4. Ralph
5. Suraj
6. Thomas
7. Taha


This is a submission for Sprint 1. There are three types of document that you will find the following places.

---

## PROCESS DOCUMENTS
Our process documents are managed in the trello platform. The link to our project page is below. We have added mattcollison2 to the board so it is visible.

trello link: [https://trello.com/b/UgXBgBLw/software-2025]

We have also taken regular snapshots of the kanban board in trello to archive our progress. These are held in the repository below.

[./process-documents/kanban-snapshot/](./process-documents/kanban-snapshot/)

Within process documents we have also included the meeting notes, agenda and minutes. These will be found in the repository below.

[./process-documents/meeting-notes/](./process-documents/meeting-notes/)

---

## TECHNICAL DOCUMENTS
Our technical documents are primarily managed on the github system. The link to the project is below:

github link: [https://github.com/sirutisb/LeadGreen]

We have also include the versioned source code for archiving.

[./technical-documents/](./technical-documents/)

Technical documents are broken down into front end and back end etc.

---

## PRODUCT DOCUMENTS
Our product documents are primarily in the form of a product UI. Below is a link to our latest version.

public link: [https://ibm/cloud/12i7dvgj/exeter-orienteering]

The UI and design documents for the client have also been archived under the link below:

[./product-documents/UI/](./product-documents/UI/)

---

## GETTING STARTED:

### 1. Ensure you have the following installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js (v18+)](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
---

### 2. **Clone the Repository**

```bash
git clone https://github.com/username/LeadGreen.git
cd LeadGreen
```

---

## Backend Setup

### 1. Go To The backend Directory

```bash
cd backend/
```

### 2. **Create a Virtual Environment**

#### Windows
```bash
python -m venv .venv
.venv\Scripts\activate
```

#### macOS/Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Make Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser (Admin):

```bash
python manage.py createsuperuser
# Enter username and password when prompted
```

### 6. Run The Django Server:

```bash
python manage.py runserver
# The backend will be live at http://localhost:8000
```

---

## Frontend Setup

### 1. Go To The Frontend Directory

```bash
cd frontend
```

### 2. Install Node Dependencies

```bash
npm i
```

### 3. Run The App

```bash
npx vite
# The frontend will be live at http://localhost:5173/
```

---

## Running Tests

### Backend Tests

```bash
cd backend
python manage.py test
```

---

## Testing Basic Functionalities

### 1. Registration
![Alt Text](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2k0bmxvbDJ4bzZ3b3VmenlleGNkbHU3MXowdGw1OXB1MHl6anM0MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4ya9mwfYOu37J9Bulg/giphy.gif)

### 2. Demo-Gameplay
![Alt Text](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm1pOWQ5NWp0NDYxN20xaHhzZHo0Y2xtaW90Y3hjNWh2ejJ6ZTZjNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SmBV5jMyNjGBQ1u6Ii/giphy.gif)

### 3. Leaderboard
![Alt Text](https://media.giphy.com/media/6ESJHByMEeR7mulQwf/giphy.gif)

### 4. Feed
![Alt Text](https://media.giphy.com/media/6gcww76abRAG36Jb78/giphy.gif)

---

## API Endpoints (For Testing)

### 1. Register

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
-H "Content-Type: application/json" \
-d '{"username":"newuser","email":"newuser@example.com","password":"password123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
-H "Content-Type: application/json" \
-d '{"username":"newuser","password":"password123"}'
```

---

## Configurations

### 1. CORS Settings (Enabled by default)
Ensure CORS settings as needed in `backend/backend/settings.py`.

---

## Project Structure

.
├── backend/                 # Django backend
│   ├── authentication/      # User authentication module
│   ├── backend/             # Backend configurations
│   ├── base/                # Base app for shared utilities
│   ├── game/                # Game-related logic
│   ├── leaderboard/         # Leaderboard management
│   ├── media/               # Media storage
│   ├── posts/               # Blog or posts-related logic
│   ├── qrcodes/             # QR code generation and management
│   ├── users/               # User-related functionality
│   ├── db.sqlite3           # SQLite database (for development)
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   ├── .gitignore           # Git ignore file
│   ├── env/                 # Virtual environment (not tracked)
│   └── .venv/               # Python virtual environment
│
├── frontend/                # Frontend built with Vite + React + Tailwind
│   ├── node_modules/        # Dependencies
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   ├── .gitignore           # Git ignore file
│   ├── eslint.config.js     # ESLint configuration
│   ├── index.html           # HTML entry point
│   ├── package.json         # Frontend dependencies
│   ├── package-lock.json    # Lockfile for dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── vite.config.js       # Vite configuration  
│
└── README.md                # Root project documentation

---
## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
**Name:** Team Lakers
**Email:** [lakers2757@gmail.com]"

