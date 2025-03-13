# Project Hours Tracker

A modern web application built with Next.js and Tailwind CSS to help you track the hours you work on various projects, both daily and weekly. The goal is to provide a clear and intuitive view of the hours worked and the remaining available hours for each project, making it easier to manage your workload effectively.

## Features

- **Project Management**: Add and manage multiple projects easily.
- **Hours Tracking**: Log the hours you work on each project every day, view total hours worked per project over the week, and instantly see remaining available hours.
- **Customizable Time Limits**: Set maximum working hours per day or for the entire week, and easily adjust limits based on your personal or project needs.
- **Full-Time Equivalent (FTE) Allocation**: Divide a full-time workload (e.g., 40 hours per week) across different projects, ensuring a balanced distribution of your time.
- **User Experience**: An intuitive dashboard that displays all projects and their corresponding hours with a clean, modern design.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the application
- [TypeScript](https://www.typescriptlang.org/) - For type safety and better developer experience
- [Tailwind CSS](https://tailwindcss.com/) - For styling the application
- [React Context API](https://reactjs.org/docs/context.html) - For state management

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-hours-tracker.git
   cd project-hours-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Dashboard**: The main page shows your weekly summary, daily hours chart, and project cards.
2. **Projects**: Manage your projects, including adding new ones, editing existing ones, and setting weekly hour allocations.
3. **Settings**: Configure your daily and weekly hour limits.

## Project Structure

- `src/app`: Contains the Next.js pages and routes
- `src/components`: Reusable React components
- `src/lib`: Utility functions, types, and context providers

## Future Enhancements

- User authentication and multi-user support
- Data persistence with a database
- Export reports as CSV or PDF
- Mobile app version
- Email notifications for approaching time limits

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for better time management tools for freelancers and professionals working on multiple projects.
