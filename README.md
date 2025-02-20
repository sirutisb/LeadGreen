## GETTING STARTED:

### 1. Ensure you have the following installed:
[Python 3.10+] (https://www.python.org/downloads/)
[Node.js (v18+)] (https://nodejs.org/en)
[Git] (https://git-scm.com/downloads)
[SQLite] (for the database)

### 2. **Clone the Repository**

```bash
git clone https://github.com/username/LeadGreen.git
cd LeadGreen

===============================================================

## Backend Setup

### 1. Go To The sustainability-site Directory
cd backend/sustainabilit-site/

### 2. **Create a Vritual Enviornment**

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

### 3. Install Python Dependencies
pip install -r backend/requirements.txt

### 4. Make Database Migrations
python manage.py makemigrations
python manage.py migrate

### 5. Create Superuser (Admin):
python manage.py createsuperuser
(Enter username and password)

### 6. Run The Django Server:
python manage.py runserver
(the backend will be live at http://localhost:8000)

===============================================================

## Frontend Setup

### 1. Go To The Frontend Directory
cd Frontend

### 2. Install Node Dependencies
npm install

###3. Run The App
npm run dev
(The Frontend will be live at http://localhost:5173/)

===============================================================

## Running Tests

### 1.Backend Tests
cd backend/sustainability-site
python manage.py test

### 2. Frontend Tests
cd Frontend
npm test

===============================================================

## Testing Basic Functionalities

### 1. Go to http://localhost:5173/login and use the superuser credentials.
### 2. Access http://localhost:5173/register and complete the sign up form

===============================================================

## API Endpoints (For Testing)

###1. Register
curl -X POST http://localhost:8000/api/register/ -H "Content-Type: application/json" -d '{"username":"newuser","email":"newuser@example.com","password":"password123"}'

###2. Login
curl -X POST http://localhost:8000/api/login/ -H "Content-Type: application/json" -d '{"username":"newuser","password":"password123"}'

===============================================================

## Configurations

### 1. Database
Edit DATABASES in backend/sustainability-site/project/settings.py for SQLite

### 2. Ensure CORS settings are enabled in backend/ustainability-site/project/settings.py


===============================================================

## Project Structure 

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

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact 
Name: TEAM LAKERS
EMAIL: lakers2757@gmail.com