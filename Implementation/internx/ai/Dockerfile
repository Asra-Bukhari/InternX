FROM python:3.11-slim

# Install system dependencies needed for MediaPipe / OpenCV / libxcb
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libxcb1 \
    libx11-xcb1 \
    libxcb-icccm4 \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-randr0 \
    libxcb-render-util0 \
    libxcb-shape0 \
    libxcb-xfixes0 \
    libxrender1 \
    libxext6 \
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
