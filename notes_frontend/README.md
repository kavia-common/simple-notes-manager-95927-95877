# Notes Frontend

A modern, light-themed Next.js app for managing notes with a responsive sidebar and editor.

## Quick Start

1) Configure the backend API base URL in a `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

2) Install dependencies and run:
```
npm install
npm run dev
```

3) Open http://localhost:3000

## Features
- List notes in a sidebar with search
- Create new note
- Edit existing note (title and content)
- Delete note
- Responsive layout (sidebar + main editor)
- Light, modern theme with:
  - primary: #2563eb
  - secondary: #f3f4f6
  - accent: #f59e42

## Project Structure
- src/lib/api.ts: API client for backend integration
- src/lib/types.ts: Shared types
- src/components/Sidebar.tsx: Sidebar list
- src/components/Editor.tsx: Note editor
- src/app/page.tsx: Main app layout and state

Ensure the backend provides REST endpoints:
- GET    /notes
- POST   /notes
- GET    /notes/:id
- PUT    /notes/:id
- DELETE /notes/:id
