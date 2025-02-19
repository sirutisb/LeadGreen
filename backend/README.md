# LeadGreen Backend Setup

## Initial Setup

### 1. Create a Python Virtual Environment

Run the following command in the project directory to create a virtual environment:
```bash
python3 -m venv .venv
```

### 2. Activate the Virtual Environment

#### On macOS/Linux:
```bash
source .venv/bin/activate
```

#### On Windows:
```bash
.venv\Scripts\activate
```

### 3. Install Dependencies

Install the dependencies with:
```bash
pip install -r requirements.txt
```

### 4. Navigate to the DjangoProject Directory

Move into the root Django backend directory (it contains manage.py):
```bash
cd backend
```

### 5. Apply Migrations

Before running the server, make and apply database migrations:
```bash
python manage.py makemigrations
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