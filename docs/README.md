# Startup Hub

A modern platform connecting founders and investors, facilitating project collaboration and investment opportunities.

## 🚀 Features

- **Authentication & Authorization**
  - Social login (GitHub, Google)
  - Role-based access control
  - Two-factor authentication

- **Project Management**
  - Create and manage projects
  - Team collaboration
  - File sharing and documentation
  - Progress tracking

- **Investment Platform**
  - Investment opportunities
  - Portfolio management
  - Transaction tracking
  - Due diligence tools

- **Learning Center**
  - Online courses
  - Progress tracking
  - Certifications
  - Resource library

## 🛠 Tech Stack

- **Frontend**
  - Next.js 13 (App Router)
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI

- **Backend**
  - Supabase
  - PostgreSQL
  - Prisma ORM

- **Authentication**
  - NextAuth.js
  - JWT

- **Storage**
  - Supabase Storage

## 🏗 Project Structure

```
startup-hub/
├── app/                # Next.js 13 app directory
│   ├── (auth)/        # Authentication routes
│   ├── dashboard/     # Dashboard routes
│   ├── projects/      # Project management
│   └── api/           # API routes
├── components/        # React components
├── lib/              # Utility functions and hooks
├── types/            # TypeScript types
├── prisma/           # Database schema and migrations
└── public/           # Static assets
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/startup-hub.git
   cd startup-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# OAuth Providers
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
GOOGLE_ID="your-google-id"
GOOGLE_SECRET="your-google-secret"

# Storage
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test auth.test.ts

# Run tests in watch mode
npm test -- --watch
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

For support, email support@startuphub.com or join our [Discord channel](https://discord.gg/startuphub).
