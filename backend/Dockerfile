FROM python:3.12-slim

WORKDIR /app

# Installe setuptools EN PREMIER pour pkg_resources
RUN pip install --no-cache-dir setuptools>=68.0.0

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]