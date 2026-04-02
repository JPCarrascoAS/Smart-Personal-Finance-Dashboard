# FinanceAI - Smart Personal Finance Dashboard

A full-stack expense tracking web application with AI-powered financial insights. Built with Next.js 16, TypeScript, Prisma, PostgreSQL, and Groq AI.

## Features

- **Dashboard** - Real-time overview with summary cards, income vs expense trend charts, and category breakdowns
- **Transaction Management** - Full CRUD for income and expenses with categories, tags, filters, search, and pagination
- **AI Insights** - Llama 3.3 70B (via Groq, free) analyzes your spending patterns, detects anomalies, and suggests saving strategies
- **Authentication** - Email/password registration + optional GitHub/Google OAuth via NextAuth v5
- **Responsive Design** - Glassmorphism dark theme optimized for desktop and mobile
- **Dockerized** - One-command setup with Docker Compose (PostgreSQL included)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| UI | Custom glassmorphism components, Framer Motion, Lucide icons |
| Charts | Recharts |
| Backend | Next.js Server Actions + API Routes |
| Database | PostgreSQL 16 via Prisma ORM 7 |
| Auth | NextAuth v5 (Auth.js) |
| AI | Groq API (Llama 3.3 70B) - free tier |
| Deployment | Docker / Vercel |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

That's it. No need to install Node.js, PostgreSQL, or anything else locally.

## Quick Start

### 1. Clone and configure

```bash
git clone <your-repo-url>
cd Smart-Personal-Finance-Dashboard
cp .env.example .env
```

### 2. Start the application

```bash
docker compose up
```

This single command will:
- Start a PostgreSQL 16 database
- Install dependencies and generate the Prisma client
- Run database migrations
- Seed default categories (Food, Transport, Housing, etc.)
- Start the Next.js development server

### 3. Open in browser

Navigate to [http://localhost:3000](http://localhost:3000)

### 4. Create an account

Click **Get started** or go to [http://localhost:3000/register](http://localhost:3000/register) to create your account.

## Usage Guide

### Adding Transactions

1. Go to **Transactions** in the sidebar
2. Click the **Add** button in the top-right
3. Fill in the form:
   - Select **Income** or **Expense**
   - Enter the amount
   - Add a description (e.g., "Grocery shopping")
   - Pick a date and category
   - Optionally add tags (comma-separated) and notes
4. Click **Add** to save

### Viewing the Dashboard

The **Dashboard** page shows:
- **Summary cards** - Total balance, monthly income, monthly expenses, and savings rate with month-over-month change percentages
- **Income vs Expenses chart** - 6-month area chart showing trends
- **Spending by Category** - Donut chart breaking down current month expenses
- **Recent Transactions** - Latest 8 transactions with quick access to the full list

### Filtering Transactions

On the **Transactions** page:
- **Search** by description using the search bar
- **Filter by type** - All, Income, or Expense
- **Filter by category** - Select any category from the dropdown
- Use the **pagination** controls at the bottom to navigate pages

### Editing and Deleting

- Click the **pencil icon** on any transaction row to edit
- Click the **trash icon** to delete (with confirmation)

### AI Insights

1. Navigate to **AI Insights** in the sidebar
2. Click **Generate** (or **Refresh** if you already have insights)
3. The AI analyzes your transaction history and generates 4 types of insights:
   - **Spending Pattern** - Analysis of your top spending categories
   - **Anomaly** - Unusual changes in spending month-over-month
   - **Saving Tip** - Concrete suggestions to save money
   - **Budget** - Budget allocation recommendations

> **Note:** AI Insights require a `GROQ_API_KEY` in your `.env` file. Get a free key at [console.groq.com](https://console.groq.com). The feature gracefully degrades without it.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string. Default points to the Docker `db` service |
| `NEXTAUTH_URL` | Yes | Base URL of the app (e.g., `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Secret for signing JWTs. Generate with `openssl rand -base64 32` |
| `AUTH_SECRET` | Yes | Same as `NEXTAUTH_SECRET` (required by Auth.js v5) |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GROQ_API_KEY` | No | Groq API key for AI insights (free at [console.groq.com](https://console.groq.com)) |

## Project Structure

```
├── docker/
│   └── entrypoint.sh           # Migrations + seed on container start
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Default categories
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login + Register pages
│   │   ├── (dashboard)/        # Dashboard layout + pages
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── transactions/   # Transactions list
│   │   │   └── insights/       # AI Insights
│   │   └── api/auth/           # NextAuth route handler
│   ├── actions/                # Server actions (transactions, analytics, insights, auth)
│   ├── components/
│   │   ├── ui/                 # Card, Button, Input, Modal, Badge, Select, Skeleton
│   │   ├── charts/             # TrendChart, CategoryChart
│   │   ├── dashboard/          # SummaryCards, RecentTransactions
│   │   ├── transactions/       # Table, Form, Filters, Pagination
│   │   ├── insights/           # InsightsPanel
│   │   ├── landing/            # Landing page
│   │   └── layout/             # Sidebar, Header
│   ├── lib/                    # Auth, Prisma, Groq, utils, validations
│   └── types/                  # TypeScript types
├── Dockerfile                  # Multi-stage (dev + production)
├── docker-compose.yml          # App + PostgreSQL
└── .env.example
```

## Development Without Docker

If you prefer running locally without Docker:

```bash
# Prerequisites: Node.js 20+, PostgreSQL running locally

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Update .env with your local PostgreSQL URL
# DATABASE_URL="postgresql://user:password@localhost:5432/finance_dashboard"

# Run migrations
npx prisma db push

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

## Deploying to Vercel

1. **Set up a PostgreSQL database** using [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/postgres)

2. **Push to GitHub** and import the repo in [Vercel](https://vercel.com)

3. **Add environment variables** in Vercel project settings:
   - `DATABASE_URL` - Your cloud PostgreSQL connection string
   - `NEXTAUTH_URL` - Your Vercel deployment URL
   - `NEXTAUTH_SECRET` / `AUTH_SECRET` - Generate a secure secret
   - `GROQ_API_KEY` - (Optional, free) For AI insights

4. **Deploy** - Vercel will automatically build and deploy

> The `Dockerfile` includes a production-optimized multi-stage build with `output: "standalone"` for minimal image size if deploying to other platforms.

## Stopping the Application

```bash
# Stop all containers
docker compose down

# Stop and remove data volume (reset database)
docker compose down -v
```

## Troubleshooting

**Port 3000 already in use:**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection issues:**
```bash
# Restart just the database
docker compose restart db

# Check database logs
docker compose logs db
```

**Reset everything:**
```bash
docker compose down -v
docker compose up --build
```

**Prisma schema changes:**
```bash
# Inside the running container
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate
```
