#!/bin/bash
echo "Building the project..."
pip install -r requirements.txt
echo "Collecting static files..."
#python manage.py collectstatic --noinput 

python manage.py makemigrations
python manage.py migrate

echo "Build completed successfully!"