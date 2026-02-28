# Detailed Setup Guide

This guide provides step-by-step instructions for setting up the NoteTaker application.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installing Node.js](#installing-nodejs)
3. [Setting Up PostgreSQL](#setting-up-postgresql)
4. [Project Setup](#project-setup)
5. [Environment Configuration](#environment-configuration)
6. [Database Migration](#database-migration)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)

## System Requirements

- **Operating System**: macOS, Linux, or Windows 10/11
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 14 or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB free space

## Installing Node.js

### macOS
```bash
# Using Homebrew
brew install node@20

# Or download from nodejs.org
# Visit: https://nodejs.org/
```

### Ubuntu/Debian
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Windows
1. Download the installer from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Follow the installation wizard
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

## Setting Up PostgreSQL

### Option 1: Local PostgreSQL Installation

#### macOS with Homebrew
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create a database
createdb notetaker

# Create a user (optional)
psql postgres -c "CREATE USER notetaker WITH PASSWORD 'your_password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE notetaker TO notetaker;"
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE notetaker;
CREATE USER notetaker WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE notetaker TO notetaker;
\q
```

#### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. During installation:
   - Set a password for the `postgres` user
   - Remember the port (default: 5432)
   - Install pgAdmin if desired
4. Open pgAdmin or psql:
   ```cmd
   # Using psql
   psql -U postgres

   # Create database
   CREATE DATABASE notetaker;
   ```

### Option 2: Cloud Database (Easier for Beginners)

#### Using Neon (Free Tier Available)
1. Visit [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project named "notetaker"
4. Copy the connection string (looks like: `postgresql://user:password@host/database`)
5. Use this connection string in your `.env` file

#### Using Supabase (Free Tier Available)
1. Visit [supabase.com](https://supabase.com)
2. Create a new account
3. Create a new project
4. Go to Settings > Database
5. Find the connection string under "Connection string"
6. Select "URI" format
7. Copy the connection string to your `.env` file

## Project Setup

### 1. Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd notetaker

# Or download and extract the ZIP file, then:
cd notetaker
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages. The installation may take 2-5 minutes.

### 3. Verify Installation
```bash
# Check if all packages are installed
npm list --depth=0
```

## Environment Configuration

### 1. Create Environment File
```bash
# Copy the example file
cp .env.example .env

# Or manually create .env file
# On Windows: copy .env.example .env
```

### 2. Generate NextAuth Secret
```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 255 }))
```

### 3. Configure Environment Variables

Edit the `.env` file:

```env
# Database Connection
# Replace with your actual database credentials
DATABASE_URL="postgresql://notetaker:your_password@localhost:5432/notetaker?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-the-generated-secret-here"

# Google OAuth (Optional - can skip initially)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI API Key (Required for AI features)
OPENAI_API_KEY="sk-your-api-key-here"
```

### Database URL Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public

Examples:
- Local: postgresql://notetaker:mypass123@localhost:5432/notetaker?schema=public
- Neon: postgresql://user:pass@ep-xyz.us-east-1.aws.neon.tech/notetaker
- Supabase: postgresql://postgres:pass@db.xyz.supabase.co:5432/postgres
```

## Database Migration

### 1. Verify Database Connection
```bash
# Test if Prisma can connect to your database
npx prisma db push --preview-feature
```

### 2. Run Initial Migration
```bash
# Create database tables
npx prisma migrate dev --name init
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database migrations applied
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Verify Database Schema
```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens a browser window at `http://localhost:5555` where you can see your database tables.

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to database"
**Solution:**
- Check if PostgreSQL is running
  ```bash
  # macOS
  brew services list | grep postgresql

  # Linux
  sudo systemctl status postgresql

  # Windows
  # Check Services app for PostgreSQL service
  ```
- Verify DATABASE_URL in `.env` is correct
- Test connection: `npx prisma db push`

#### 2. "Command not found: npx"
**Solution:**
- Node.js not installed or not in PATH
- Reinstall Node.js
- Restart terminal after installation

#### 3. "Port 3000 already in use"
**Solution:**
```bash
# Find process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use a different port
PORT=3001 npm run dev
```

#### 4. "Prisma Client not generated"
**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# If that fails, clear cache and regenerate
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

#### 5. "OpenAI API error"
**Solution:**
- Verify your OpenAI API key is correct
- Check if you have billing enabled on OpenAI account
- Verify you have credits available
- AI features require an active OpenAI account

#### 6. "Module not found" errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 7. Database Migration Errors
**Solution:**
```bash
# Reset database (WARNING: This deletes all data)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name fix_schema
```

### Getting Help

If you encounter issues not covered here:

1. Check the error message carefully
2. Search for the error in [GitHub Issues](https://github.com/your-repo/issues)
3. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
4. Check Prisma documentation: [prisma.io/docs](https://www.prisma.io/docs)
5. Create a new issue with:
   - Your operating system
   - Node.js version (`node --version`)
   - Complete error message
   - Steps to reproduce

## Next Steps

After successful setup:

1. **Create an account**: Go to `/signup`
2. **Create your first note**: Click the "+" button
3. **Try AI features**: Click "AI Assistant" button
4. **Organize with folders**: Create folders in the sidebar
5. **Customize theme**: Use the theme toggle in the sidebar

## Development Tips

### Useful Commands

```bash
# View database in browser
npx prisma studio

# Format Prisma schema
npx prisma format

# Check for Prisma issues
npx prisma validate

# View logs in development
# Logs appear in terminal where npm run dev is running

# Clear all caches
rm -rf .next node_modules/.cache

# Update dependencies
npm update
```

### Development Workflow

1. Make changes to code
2. Next.js auto-reloads in browser
3. Check terminal for errors
4. Test features in browser
5. Check Network tab in browser DevTools for API errors

### Database Changes

When modifying `prisma/schema.prisma`:

```bash
# Create migration
npx prisma migrate dev --name describe_your_changes

# Apply to database
npx prisma generate

# Restart dev server
# Press Ctrl+C then npm run dev
```

## Security Notes

- Never commit `.env` file to version control
- Keep your OpenAI API key secure
- Use strong passwords for database
- Regenerate NEXTAUTH_SECRET for production
- Enable 2FA on your cloud database if available

## Performance Tips

- Use cloud database in same region as your deployment
- Enable connection pooling for production
- Monitor OpenAI API usage to control costs
- Consider caching for frequently accessed data

## Deployment Preparation

Before deploying to production:

1. Set `NODE_ENV=production` in environment
2. Update `NEXTAUTH_URL` to your production domain
3. Use production database (not development)
4. Enable SSL for database connection
5. Set up proper error logging (e.g., Sentry)
6. Configure CORS if needed
7. Set up monitoring and alerts
