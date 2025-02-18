
# REST API Concepts Explorer

An interactive educational application that teaches REST API concepts through a journey across our solar system. Each planet represents different API endpoints and operations, providing a fun and engaging way to learn about REST APIs.

## Features

- Interactive tutorials for learning REST API concepts
- Planet-based visualization of API endpoints
- User authentication system
- Progress tracking
- Interactive quizzes
- Responsive UI design

## Technologies Used

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS with Shadcn UI
- **State Management**: React Query
- **Authentication**: Passport.js

## Prerequisites

Before running the application, make sure you have:
- Node.js installed
- PostgreSQL database set up
- NPM or Yarn package manager

## Environment Variables

Create a `.env` file with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/your_database_name
SESSION_SECRET=your_session_secret
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared TypeScript types and schemas
- `/components` - Reusable React components
- `/pages` - React components that represent pages

## API Endpoints

- `GET /api/planets` - Get all planets
- `GET /api/planets/:id` - Get specific planet
- `GET /api/concepts` - Get all REST concepts
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/progress` - Get user progress
- `POST /api/quiz/submit` - Submit quiz answers

## License

This project is licensed under the MIT License.
