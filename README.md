## LeadGreen - Sustainability Game

LeadGreen is a web application with a Django backend and a React frontend designed to promote sustainable habits through gamification. Users can post their eco-friendly actions, such as recycling, reducing vehicle travel, and saving electricity, by scanning a QR code. Each post earns points that users can spend to grow their virtual plant by watering, fertilizing, and cleaning it. HELP US CREATE CARBON NEUTRAL ENVIORNMENT.

## GETTING STARTED:

### 1. Ensure you have the following installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js (v18+)](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
- [SQLite](https://www.sqlite.org/download.html) (for the database)

---

### 2. **Clone the Repository**

```bash
git clone https://github.com/username/LeadGreen.git
cd LeadGreen
```

---

## Backend Setup

### 1. Go To The sustainability-site Directory

```bash
cd backend/sustainability-site/
```

### 2. **Create a Virtual Environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r backend/requirements.txt
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
cd Frontend
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Run The App

```bash
npm run dev
# The frontend will be live at http://localhost:5173/
```

---

## Running Tests

### 1. Backend Tests

```bash
cd backend/sustainability-site
python manage.py test
```

### 2. Frontend Tests

```bash
cd Frontend
npm test
```

---

## Testing Basic Functionalities

1. Go to [http://localhost:5173/login](http://localhost:5173/login) and use the superuser credentials.
2. Access [http://localhost:5173/register](http://localhost:5173/register) and complete the sign-up form.

---

## API Endpoints (For Testing)

### 1. Register

```bash
curl -X POST http://localhost:8000/api/register/ \
-H "Content-Type: application/json" \
-d '{"username":"newuser","email":"newuser@example.com","password":"password123"}'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/login/ \
-H "Content-Type: application/json" \
-d '{"username":"newuser","password":"password123"}'
```

---

## Configurations

### 1. Database
Edit `DATABASES` in `backend/sustainability-site/project/settings.py` for SQLite.

### 2. CORS Settings
Ensure CORS settings are enabled in `backend/sustainability-site/project/settings.py`.

---

## Project Structure

```
LeadGreen/                      # Project root directory
├── .venv/                      # Virtual environment for Python packages
├── backend/                    # Django backend for server-side logic
│   └── sustainability-site/    # Main Django project folder
│       ├── home/               # Django app for home-related functionalities
│       ├── project/            # Core project settings and configurations
│       ├── users/              # Django app for user authentication and profiles
├── env/                        # Python environment configuration
│   ├── Include/                # C headers for Python packages
│   ├── Lib/                    # Installed Python packages
│   └── Scripts/                # Executable scripts (e.g., virtual environment activation)
├── Frontend/                   # React frontend for user interface
│   ├── .vite/                  # Vite configuration and cache
│   ├── node_modules/           # Installed npm packages for React
│   ├── public/                 # Static files (e.g., index.html)
│   └── src/                    # React source code
│       ├── assets/             # Static resources like images and fonts
│       ├── Components/         # Reusable React components (buttons, forms)
│       ├── Hooks/              # Custom React hooks for state management
│       └── Pages/              # React pages (e.g., Home, Login, Dashboard)
```

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
**Name:** TEAM LAKERS  
**Email:** [lakers2757@gmail.com](mailto:lakers2757@gmail.com)"

