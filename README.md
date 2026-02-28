# NoteTaker - Advanced Note-Taking Application

A modern, web-based note-taking application with AI-powered features, rich text editing, and intelligent organization.

## Features

### Core Features
- **Rich Text Editor**: Powered by Tiptap with full formatting support
  - Bold, italic, strikethrough, code
  - Headings (H1, H2, H3)
  - Bulleted and numbered lists
  - Task lists with checkboxes
  - Links and blockquotes
  - Undo/redo functionality

- **Note Management**
  - Create, edit, and delete notes
  - Auto-save as you type
  - Full-text search across all notes
  - Real-time word and character count
  - Note versioning and history

- **Organization System**
  - Nested folder structure
  - Drag-and-drop organization
  - Tag support
  - Favorites and pinned notes

- **AI-Powered Features**
  - Grammar and spelling correction
  - Text improvement (formal, casual, professional tones)
  - Expand or shorten text
  - Summarization
  - Key points extraction
  - Auto-tagging suggestions
  - Action items detection
  - Continue writing assistance

- **User Experience**
  - Three-panel layout (folders | notes | editor)
  - Dark mode with theme persistence
  - Responsive design
  - Collapsible sidebars

### Authentication
- Email/password authentication
- Google OAuth integration
- Secure session management with NextAuth.js

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Tiptap (ProseMirror)
- **Icons**: Lucide React
- **State Management**: React hooks + Zustand
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: OpenAI API (GPT-4o-mini)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notetaker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/notetaker?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

   # OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # OpenAI API
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npx prisma migrate dev --name init

   # Generate Prisma client
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Local PostgreSQL Setup

#### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb notetaker
```

#### Ubuntu/Debian
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb notetaker
sudo -u postgres psql -c "CREATE USER notetaker WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE notetaker TO notetaker;"
```

#### Windows
1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation, set a password for the postgres user
3. Use pgAdmin or psql to create a database named `notetaker`

### Cloud Database Options

#### Neon (Recommended for development)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env` file

#### Supabase
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)

#### Railway
1. Sign up at [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the DATABASE_URL from the variables tab

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env` file

## OpenAI API Setup

1. Sign up at [OpenAI](https://platform.openai.com/)
2. Go to [API Keys](https://platform.openai.com/api-keys)
3. Create a new API key
4. Copy the key to your `.env` file as `OPENAI_API_KEY`
5. Add billing information to activate the API

**Note**: AI features will not work without a valid OpenAI API key. The app uses GPT-4o-mini which is cost-effective for this use case.

## Project Structure

```
notetaker/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── notes/          # Note CRUD operations
│   │   ├── folders/        # Folder management
│   │   └── ai/             # AI features endpoints
│   ├── app/                # Main application
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── editor/             # Editor components
│   ├── notes/              # Note-related components
│   ├── sidebar/            # Sidebar components
│   ├── providers/          # Context providers
│   └── ui/                 # UI components
├── lib/                     # Utility libraries
│   ├── ai/                 # AI integration
│   ├── auth/               # Authentication helpers
│   └── db/                 # Database client
├── prisma/                  # Prisma schema and migrations
│   └── schema.prisma       # Database schema
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client

## Usage Guide

### Creating Your First Note

1. Sign up for an account or sign in
2. Click the "+" button in the notes panel
3. Start typing in the editor
4. Your note auto-saves as you type

### Organizing with Folders

1. Click the "+" icon next to "Folders" in the sidebar
2. Type a folder name and press Enter
3. Drag notes into folders or select a folder before creating a note

### Using AI Features

1. Select text in your note or use the entire note
2. Click the "AI Assistant" button
3. Choose an action:
   - **Improve Tab**: Fix grammar, change tone, expand/shorten
   - **Analyze Tab**: Summarize, extract key points, suggest tags, find action items
4. Review the AI-generated result
5. Click "Apply to Note" to use the suggestion

### Keyboard Shortcuts

- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Sign up at [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

### Upcoming Features
- [ ] Offline mode with IndexedDB
- [ ] Mobile responsiveness improvements
- [ ] Collaborative editing
- [ ] Browser extension (web clipper)
- [ ] Export to PDF/Markdown
- [ ] Note templates
- [ ] Advanced search filters
- [ ] Public note sharing
- [ ] Mobile apps (iOS/Android)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Rich text editing powered by [Tiptap](https://tiptap.dev/)
- AI features powered by [OpenAI](https://openai.com/)
- Icons by [Lucide](https://lucide.dev/)
