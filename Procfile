release: python manage.py makemigrations && python manage.py migrate
web: gunicorn drf_api.wsgi
web: serve -s build