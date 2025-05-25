<div style="display: flex; align-items: center; gap: 10px;">
<img src="public/logo.png" alt="CBMO AI Chat" width="50" />
<h1>CBMO AI Chat</h1>
</div>

A modern, AI-powered chat application built with Next.js, featuring seamless authentication, real-time messaging, and integration with Google's Gemini AI.

## 🚀 Features

### 1. Chat Interface
- [x] Clean, modern chat UI using Shadcn components
- [x] Message bubbles for user and AI responses
- [x] Input field with send button
- [x] Auto-scroll to latest message

### 2. API Integration
- [x] `/api/chat` route in Next.js
- [x] Google Gemini API integration using `@google/generative-ai`
- [x] Proper handling of streaming responses
- [x] Comprehensive error handling for API failures

### 3. Real-time Streaming
- [x] Display AI responses as they stream in
- [x] Typing indicator while waiting for responses
- [x] Graceful handling of connection errors

### 4. State Management
- [x] Chat history management
- [x] Loading states for better UX
- [x] Clear chat functionality

### 5. Bonus Points
- [x] Responsive design
- [x] Dark/Light mode support
- [x] Loading animations.
- [x] Mobile-friendly interface
- [x] Message copy to clipboard

### 6. Extra Features
- [x] Markdown support with syntax highlighting
- [x] Secure authentication with Clerk
- [x] Social login options
- [x] Protected routes
- [x] Smooth animations and transitions
- [x] Webhooks for user management
- [x] Database integration with Prisma
- [x] Multi Models of Gemini
- [x] Search chats

### Development
- [x] **Tech Stack**
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Prisma ORM
  - React Query
  - Zustand for state management

## 📦 Deliverables

- [x] GitHub Repository with clean, documented code
- [x] Live Demo (deployed on Vercel/Netlify)
- [x] Comprehensive README with setup instructions
- [x] Environment variables template (`.env.example`)

## 🛠️ Prerequisites

Before you begin, ensure you have the following:

- Node.js (v18 or later)
- npm
- [NeonDB](https://neon.tech/) Account (for PostgreSQL database)
- [Clerk](https://clerk.com/) account (for authentication)
- [Google AI API key](https://ai.google.dev/)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/benedicti0n/cbmo-ai-chat.git
   cd cbmo-ai-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the `.env.example` file to `.env` and update the values:
   ```env
    GEMINI_API_KEY="<Your API Key>"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<Your Publishable Key>"
    CLERK_SECRET_KEY="<Your Secret Key>"
    DATABASE_URL="<Your Database URL>"
    CLERK_WEBHOOK_SECRET="<Your Webhook Secret>"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Generate Prisma Client
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🧪 Running Tests

To run tests, use the following command:

```bash
npm test
# or
yarn test
```

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## 🚀 Deployment

### Vercel
1. Push your code to a GitHub repository
2. Import the project on [Vercel](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Run development server: `npm run dev`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.com/)
- [Google AI](https://googleapis.github.io/js-genai/release_docs/classes/models.Models.html)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ and Hardwork by [Ashesh Bandopadhyay](https://github.com/benedicti0n)
