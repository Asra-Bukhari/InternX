FROM python:3.11-slim

# Install system dependencies needed for MediaPipe / OpenCV headless
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Set permissions for Hugging Face container directory
RUN chmod -R 777 /app

# Expose Hugging Face default port
EXPOSE 7860

# Run using gunicorn for production performance
CMD ["gunicorn", "-b", "0.0.0.0:7860", "--timeout", "120", "app:app"]
