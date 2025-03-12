# back/Dockerfile

# 1) Base image
FROM python:3.13-slim

# 2) Set working directory
WORKDIR /app

# 3) Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4) Copy rest of backend code
COPY . .

# 5) Expose the port Django will run on (optional)
EXPOSE 8000

# 6) Run migrations & start server (or use docker-compose command override)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
