# CSS Academy - Interactive CSS Learning Platform

A modern web application designed to teach CSS concepts through interactive lessons and hands-on coding exercises.

## Features

- 🎯 **Interactive Lessons**: Step-by-step CSS tutorials with live code editor
- 🎮 **CSS Playground**: Experiment with CSS properties in real-time
- 📊 **Progress Tracking**: Monitor your learning journey with detailed analytics
- 🌙 **Dark/Light Mode**: Toggle between themes for comfortable learning
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Code Validation**: Real-time syntax checking and error detection

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express (for local development)
- **Deployment**: Vercel (Serverless Functions)
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: TanStack Query
- **Routing**: Wouter

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CSSMastery
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Run TypeScript type checking
- `npm start` - Start production server (after build)

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your deployment

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import your project in the Vercel dashboard
4. Vercel will automatically detect the configuration and deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically configure the build settings based on `vercel.json`

## Project Structure

```
CSSMastery/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/
│   ├── api/               # Vercel serverless functions
│   ├── storage.ts         # In-memory data storage
│   └── routes.ts          # Express routes (local dev)
├── shared/                # Shared types and schemas
├── vercel.json            # Vercel deployment configuration
└── package.json           # Root package configuration
```

## API Endpoints

All API endpoints are available at `/api/`:

- `GET /api/modules` - Get all learning modules
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/[id]` - Get specific lesson
- `GET /api/lessons/module/[module]` - Get lessons by module
- `GET /api/progress/[userId]` - Get user progress
- `POST /api/progress` - Update user progress
- `GET /api/user/default` - Get default user

## Environment Variables

For local development, you can create a `.env.local` file:

```env
NODE_ENV=development
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
