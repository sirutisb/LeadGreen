## LeadGreen - Sustainability Game
LeadGreen is a web application with a Django backend and a React frontend designed to promote sustainable habits through gamification. Users can post their eco-friendly actions, such as recycling, reducing vehicle travel, and saving electricity, by scanning a QR code. Each post earns points that users can spend to grow their virtual plant by watering, fertilizing, and cleaning it. HELP US CREATE CARBON NEUTRAL ENVIORNMENT.

When you complete a sustainable activity such as picking up litter or using public transport, you scan a QR code at that location and post a photo of what you have done. You will then be awarded points based on what the activity was and your photo will be uploaded to the feed where other users can see your activity.

You can then spend these points growing your plant. Using water, soil, etc. As your plant grows it will level up unlocking new appearances.  

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

### 1. Backend Tests

```bash
cd backend
python manage.py test
```

### 2. Frontend Tests

```bash
cd frontend
npm test
```

---

## Testing Basic Functionalities

1. Access [http://localhost:5173/register](http://localhost:5173/register) and complete the sign-up form.
2. Go to [http://localhost:5173/login](http://localhost:5173/login) and use the superuser credentials.

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

### 1. Database
Edit `DATABASES` in `backend/backend/settings.py` for SQLite.

### 2. CORS Settings (Enabled by default)
Ensure CORS settings as needed in `backend/backend/settings.py`.

---

## Project Structure

.
├── .venv/                # Virtual environment for dependencies
├── backend/              # Django backend application
│   ├── authentication/   # User authentication and authorization
│   ├── backend/          # Core backend settings and configurations
│   ├── base/             # Common utilities and helper functions
│   ├── game/             # Game-related models, views, and logic
│   ├── leaderboard/      # Leaderboard functionality for game scoring
│   ├── media/            # Uploaded media files (e.g., images, documents)
│   ├── posts/            # Blog or post-related functionality (if applicable)
│   ├── qrcodes/          # QR code generation and management
│   ├── users/            # User profile management
│   ├── .gitignore        # Files and folders to ignore in version control
│   ├── db.sqlite3        # SQLite database for development
│   ├── manage.py         # Django's management command-line tool
│   ├── README.md         # Project documentation for the backend
│   └── requirements.txt  # Backend Python package dependencies
├── env/                  # Environment variables and settings (if used)
├── frontend/             # Frontend codebase (React, HTML, CSS, JS)
├── README.md             # Project documentation (main)


## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
**Name:** Team Lakers
**Email:** [lakers2757@gmail.com](mailto:lakers2757@gmail.com)"

