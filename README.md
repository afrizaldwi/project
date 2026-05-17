### 1. Clone the Repository
Buka terminal dan clone repository:

```
git clone <url-repository-web>
cd <repository-web>
````

### 2\. Environment Configuration

  * copas file bernama `.env.example` di root folder.
  * Rename file hasil copas tersebut menjadi `.env`.

  * buka folder frontend dan copas file bernama `.env.example`.
  * Rename file hasil copas tersebut menjadi `.env`.

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
docker exec -it laravel-api php artisan migrate:fresh --seed
```

-----

## 🌐 Accessing the Application

Setelah semuanya selesai, buka halaman berikut di browser:

  * **Web Dashboard (React/Vite):** [http://localhost:5173](http://localhost:5173)
  * **API Gateway (Laravel/Nginx):** [http://localhost:8000](http://localhost:8000)

-----
