# BBR API

A RESTful API built with **NestJS** and **Knex.js** to manage user data with a **PostgreSQL** database. This project provides endpoints for creating, reading, updating, and deleting users, with input validation and database synchronization.

## 🌟 Features

- Input validation using **class-validator**
- Database migration support with [**Knex.js**](https://knexjs.org/)
- Dynamic entity discovery for scalable entity management
- Logging for debugging and monitoring

## 🛠 Prerequisites

- **Node.js** (version **18.x** or later recommended)
- **npm** (version **8.x** or later)
- **pnpm** (version **9.x** or later)
- **PostgreSQL** (version **12.x** or later)
- **Git** (for cloning the repository)

## 📥 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/bbr-api.git
cd bbr-api
```

### 2️⃣ Install dependencies

```bash
pnpm install
```

## ⚙️ Configuration

### 1️⃣ Create a `.env` file

Create a new `.env.development.local` file in the root directory. Add the following environment variables, all variables are presented in .env.example:

### 2️⃣ Set up the database

Create a **PostgreSQL database** with the name specified in `DB_DATABASE`.

```sql
CREATE DATABASE your_database_name;
```

## 🚀 Running the Application

### 1️⃣ Build the project

```bash
pnpm run build
```

### 2️⃣ Start the application in development mode

```bash
pnpm run start:dev
```

The API will be available at **http://localhost:3000**.

### 3️⃣ Run Postgres database migrations

```bash
pnpm run migration:knex:run
```

### 4️⃣ Seed Postgres the database (Optional)

#### (RECOMMENDED) This command lets you interactively choose a seed file from your configured seeds directory

```bash
pnpm run seed:knex:run
```

#### Run all seeders at once (use only if fresh setup)

```bash
pnpm run seed:knex:run:all
```

## 📔 Migrations & Seeds

### ⛏️ Generate new migration

```bash
pnpm knex migrate:make create_my_entity
```

### 🌱 Generate new seed

```bash
pnpm knex seed:make xx_seed_my_entity
```

xx - present order

## 📡 API Endpoints

### 🌐 Base URL

```
http://localhost:3000
```

## 💳 Stripe

### Configuration for local testing stripe webhooks

Step 1: Login (only first time)

```
stripe login
```

Step 2: Start up listener for webhooks

```
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe
```

### 📖 Swagger Documentation

- Access the Swagger UI to explore and test the API endpoints interactively.
- **URL**: http://localhost:3000/api-docs
- The Swagger UI provides detailed documentation for all endpoints, including request/response schemas and example requests.
