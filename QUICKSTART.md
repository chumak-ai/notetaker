# Quick Start Guide

Get NoteTaker up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use a free cloud database like Neon)
- OpenAI API key

## 5-Minute Setup

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Set Up Database (2 min)

**Option A: Use Neon (Easiest)**
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a project
3. Copy the connection string

**Option B: Local PostgreSQL**
```bash
# macOS
brew install postgresql@16
brew services start postgresql@16
createdb notetaker

# Ubuntu
sudo apt install postgresql
sudo -u postgres createdb notetaker
```

### 3. Configure Environment (1 min)
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="your-database-connection-string"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Initialize Database (30 seconds)
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the App (30 seconds)
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Sign Up**: Create an account at `/signup`
2. **Create a Note**: Click the "+" button in the notes panel
3. **Try AI**: Select some text and click "AI Assistant"
4. **Organize**: Create folders in the left sidebar
5. **Customize**: Toggle dark mode in the sidebar footer

## Need Help?

- Full setup guide: See [SETUP.md](./SETUP.md)
- Documentation: See [README.md](./README.md)
- Issues: Check the troubleshooting section in SETUP.md

## Common Issues

**"Cannot connect to database"**
- Verify your DATABASE_URL is correct
- Make sure PostgreSQL is running

**"OpenAI API error"**
- Check your API key is valid
- Ensure you have billing enabled on OpenAI

**Port 3000 in use**
```bash
# Use a different port
PORT=3001 npm run dev
```

## What's Next?

- Explore all AI features (improve text, summarize, extract key points)
- Create nested folders for organization
- Try different themes (light/dark/system)
- Check out keyboard shortcuts (Cmd/Ctrl + B for bold, etc.)

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npx prisma studio    # Open database GUI
```

Enjoy taking notes with AI! 📝✨
