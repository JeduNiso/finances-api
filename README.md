# 💰 Finances — Family Finance Manager

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/React_Native-Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" />
</p>

> A full-stack family finance management system with a REST API backend, React web app, and React Native mobile app. Track shared expenses, fixed costs, debts, and bank accounts across your entire family group.

---

## ✨ Features

- 👨‍👩‍👧 **Family groups** — invite members, assign roles (owner / admin / member)
- 🏦 **Multi-account** — manage multiple bank accounts per family
- 💸 **Spending tracker** — log daily expenses by category with balance auto-deduction
- 📅 **Fixed expenses** — recurring monthly bills with payment calendar
- 💳 **Debt manager** — track debts with payment history and progress percentage
- 📊 **Dashboard** — balance overview, spending by category, top expenses, member breakdown
- 🔐 **Auth** — token-based authentication via Laravel Sanctum

---

## 🗂 Project Structure

```
finances/
├── app/                  # Laravel backend (API)
│   ├── Http/Controllers/Api/
│   ├── Http/Requests/
│   ├── Http/Resources/
│   └── Models/
├── database/migrations/  # 13 MySQL tables
├── resources/js/         # React 19 SPA
│   ├── pages/
│   ├── components/
│   ├── stores/           # Zustand state management
│   ├── api/              # Axios API layer
│   └── router/
└── src/                  # React Native (Expo) mobile app
    ├── screens/
    ├── navigation/
    ├── stores/
    ├── api/
    └── constants/
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.4, Laravel Sanctum |
| Database | MySQL 8 |
| Web Frontend | React 19, Vite, Tailwind CSS v4, Zustand, Recharts |
| Mobile | React Native, Expo SDK 52, React Navigation v7 |
| Deployment | Railway (API + DB), Vercel (Web) |

---

## 🚀 Local Setup

### Prerequisites
- PHP 8.4, Composer
- Node.js 22+
- MySQL 8

### Backend

```bash
git clone https://github.com/JeduNiso/finances-api.git
cd finances

cp .env.example .env
# Fill in DB_* and APP_KEY in .env

composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Web Frontend

```bash
npm install
npm run dev
```

> Set `VITE_API_URL=http://localhost:8000/api` in `.env`

### Mobile (Expo)

```bash
cd src
npx expo start
```

> Set `apiUrl` in `app.config.js` extra → `http://YOUR_LOCAL_IP:8000/api`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register + create family |
| POST | `/api/auth/login` | Login, returns token |
| GET | `/api/dashboard` | Full dashboard summary |
| GET/POST | `/api/spending` | List / create spending |
| GET/POST | `/api/expenses` | Fixed expenses |
| POST | `/api/expenses/{id}/pay` | Pay a fixed expense |
| GET/POST | `/api/debts` | Debts list / create |
| POST | `/api/debts/{id}/payment` | Register debt payment |
| GET/POST | `/api/accounts` | Bank accounts |
| GET/POST | `/api/families/invite` | Invite family member |

All protected routes require `Authorization: Bearer {token}`.

---

## 📦 Deployment

### Backend → Railway
- Auto-detected via `nixpacks.toml` (PHP 8.4 + Composer + Node)
- MySQL plugin linked via Railway env vars
- Migrations run automatically on deploy (`php artisan migrate --force`)

### Frontend → Vercel
- Connect GitHub repo, set `VITE_API_URL` env var
- Auto-builds on every push with `npm run build`

---

## 📄 License

MIT © [JeduNiso](https://github.com/JeduNiso)

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
