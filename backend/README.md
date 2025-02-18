# LeadGreen Backend Setup

## Initial Setup

### 1. Create a Python Virtual Environment

Make sure to cd into the backend directory before running the following commands.
```bash
cd backend
```

Run the following command in the backend directory to create a virtual environment:
```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment

#### On macOS/Linux:
```bash
source venv/bin/activate
```

#### On Windows:
```bash
venv\Scripts\activate
```

### 3. Install Dependencies

Install the Django and Django REST framework from the requirements.txt file:
```bash
pip install -r requirements.txt
```
You can also install the dependencies manually:
```bash
pip install django djangorestframework
```

### 4. Navigate to the Project Directory

Move into the Django project directory:
```bash
cd sustainability-site
```

### 5. Apply Migrations

Before running the server, apply database migrations:
```bash
python manage.py migrate
```

### 6. Create a Superuser (Admin Account)

Run the following command and follow the prompts to create an admin account:
```bash
python manage.py createsuperuser
```

### 7. Run the Development Server

Start the Django development server:
```bash
python manage.py runserver
```

Now, you can log in to the admin panel at `http://127.0.0.1:8000/admin/` using the superuser credentials you created.