# Running Superblock Landing Page Locally

MySQL runs in an isolated Docker container. Backend (Laravel) and Frontend (React) run on your host.

## Prerequisites

- Docker & Docker Compose
- PHP 8.1+ (for Laravel backend)
- Composer
- Node.js 18+ & Yarn (for React frontend)

## Quick Start

### 1. Start MySQL (Docker)

```bash
cd /Users/map/Dev_works/sbxtoken/superblock_landing-page
docker compose up -d mysql
```

On first run, the container will:
- Create database `sbxtoken`
- Import `sbxtoken_backup.sql` from `/Users/map/Dev_works/sbxtoken/`

Import takes 30–60 seconds. Check logs:
```bash
docker compose logs -f mysql
```
Wait until you see "Import completed" and "ready for connections".

### 2. Backend (Laravel)

```bash
cd Backend
composer install
php artisan key:generate   # if APP_KEY is empty in .env
php artisan serve
```

API: http://localhost:8000

### 3. Frontend (React)

```bash
cd FrontEnd
yarn install
yarn start
```

App: http://localhost:3000

### 4. WalletConnect (for Web3 features)

Create a free project at https://cloud.walletconnect.com and add to `FrontEnd/.env`:
```
REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Ports

| Service     | Port |
|------------|------|
| MySQL      | 3307 (host) → 3306 (container) |
| Laravel API| 8000 |
| React      | 3000 |

## Stopping

```bash
# Stop MySQL
docker compose down

# Or stop and remove data volume (fresh DB on next start)
docker compose down -v
```

## DB Dump Location

Expected path: `/Users/map/Dev_works/sbxtoken/sbxtoken_backup.sql`

Mounted in docker-compose as `../sbxtoken_backup.sql` (relative to project root).
