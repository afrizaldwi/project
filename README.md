### 1. Clone the Repository
Buka terminal dan clone repository:

```
git clone https://github.com/afrizaldwi/test11.git
cd test11
````

### 2\. Environment Configuration

  * buka folder server dan copas file bernama `.env.example`.
  * Rename file hasil copas tersebut menjadi `.env`.

### 3\. Boot the Universe

Start the Docker containers.

```
docker compose up -d --build
```

*Tunggu hingga proses selesai*

### 4\. Install Backend Dependencies

```
docker exec -it laravel-api composer install
```

### 5\. Generate Keys and Migrate the Database

```
docker exec -it laravel-api php artisan key:generate
docker exec -it laravel-api php artisan migrate
```

-----

## 🌐 Accessing the Application

Setelah semuanya selesai, buka halaman berikut di browser:

  * **Web Dashboard (React/Vite):** [http://localhost:5173](http://http://localhost:5173)
  * **API Gateway (Laravel/Nginx):** [http://localhost:8000](http://http://localhost:8000)

-----
