# Clara Election Awareness Portal

Clara is a modern, responsive web application designed to help voters make informed decisions by providing detailed information about political candidates, their positions on important issues, and tools to compare candidates.

## Features

- **Candidate Profiles**: Detailed information on political candidates
- **Issue Exploration**: View candidate stances on key political issues
- **Candidate Comparison**: Side-by-side comparison of candidates
- **Values Quiz**: Interactive quiz to find candidates that align with your values
- **My Picks**: Save your favorite candidates and comparison results
- **Ask**: Chat interface for questions about candidates and issues

## Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/clara.git
cd clara/Clara_FE
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
Clara_FE/
├─ app/                         # App router routes
│   ├─ layout.tsx               # Root layout
│   ├─ page.tsx                 # Home (Landing)
│   ├─ candidates/              # Candidates listing
│   ├─ candidate/[id]/          # Individual candidate profile
│   ├─ compare/[a]/[b]/         # Candidate comparison
│   ├─ issues/[slug]/           # Issue-focused pages
│   ├─ quiz/                    # Values quiz
│   ├─ my-picks/                # Saved bookmarks
│   ├─ ask/                     # Question interface
│   ├─ admin/                   # Admin section (protected)
│   └─ api/auth/[...nextauth]/  # Auth endpoints
├─ components/                  # React components
│   ├─ common/                  # Shared UI components
│   ├─ candidate/               # Candidate-specific components
│   ├─ quiz/                    # Quiz components
│   ├─ chat/                    # Chat interface components
│   └─ layout/                  # Layout components
├─ context/                     # React Context providers
├─ hooks/                       # Custom React hooks
├─ lib/                         # Utility functions and dummy data
├─ styles/                      # Global styles
└─ public/                      # Static assets
```

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 