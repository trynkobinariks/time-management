# Time Management Application

A web application for managing time, tasks, and productivity using Next.js, React, and Supabase for authentication and data storage.

## Features

- User authentication with Supabase
- Task management
- Time tracking
- Dashboard with productivity insights

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (Auth, Database)
- **Hosting**: Vercel (or your preferred hosting solution)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd time-management
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

The project can be easily deployed to Vercel or any other hosting platform that supports Next.js applications.

## License

[MIT](LICENSE)
