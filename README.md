# Subscript

**Every subscription. One clear picture.**

Subscript is a personal subscription manager and recurring-expense tracker:
track every service you pay for, see your true monthly and annual spend,
watch the renewal calendar, get date-based reminders, and stay inside a
monthly budget.

No login, no accounts, no cloud — a single-user app whose data lives in
your local MySQL database.

## Tech stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Backend   | Java 21, Spring Boot 3.5.16 (embedded Tomcat), Spring Data JPA (Hibernate), Jakarta Bean Validation |
| Frontend  | React 19 + Vite 7, JavaScript, Chart.js 4, custom CSS   |
| Database  | MySQL 8 (two tables: `subscriptions`, `budget`)         |

## Project structure

```
subscript/
├── database/
│   ├── schema.sql        # create database, tables, constraints, indexes (run once)
│   └── seed.sql          # optional sample data with dates relative to today
├── backend/              # Spring Boot REST API (port 8080)
│   └── src/main/java/com/subscript/
│       ├── controller/   # SubscriptionController, BudgetController, DashboardController
│       ├── service/      # SubscriptionService, BudgetService, DashboardService (all calculations)
│       ├── repository/   # Spring Data JPA interfaces
│       ├── model/        # Subscription, Budget entities + BillingFrequency, Category, SubscriptionStatus enums
│       ├── dto/          # request/response records (validated)
│       ├── exception/    # ResourceNotFoundException + GlobalExceptionHandler
│       └── config/       # WebConfig (CORS for the Vite dev server)
└── frontend/             # React app (port 5173)
    └── src/
        ├── pages/        # Landing, Dashboard, Subscriptions, Calendar, Analytics, Budget
        ├── components/   # cards, form, modal, calendar grid, charts, reminders…
        ├── services/     # api.js — the only place that talks to the backend
        └── styles/       # global.css (design system), app.css, calendar.css, landing.css
```

## Local setup

1. **Create the schema** — open `database/schema.sql` in MySQL Workbench and execute it
   (or run `mysql -u root -p < database/schema.sql` in a terminal).
2. **Configure credentials** — open `backend/src/main/resources/application.properties`
   and replace `YOUR_MYSQL_USERNAME` / `YOUR_MYSQL_PASSWORD` with your MySQL credentials.
3. **(Optional) Load sample data** — execute `database/seed.sql` the same way.

## Running the app

```bash
# Terminal 1 — backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install   # first time only
npm run dev
```

Open **http://localhost:5173** — the landing page. "Explore Dashboard" takes you into the app.


