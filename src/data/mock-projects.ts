
import type { Project } from '@/types/project';

const projects: Project[] = [
  {
    id: 'tetris',
    name: 'Tetris',
    iconUrl: 'https://picsum.photos/seed/tetris/40/40', // Placeholder, will be overwritten
    demoGifUrl: 'https://picsum.photos/seed/tetris-demo/400/300', // Placeholder, will be overwritten
    readmeContent: `
# Tetris Clone

A classic Tetris game implemented in React and Canvas.

## Overview
This project is a faithful recreation of the iconic puzzle game Tetris. It features a scoring system, level progression, and responsive controls.

## Technologies
- React
- HTML5 Canvas
- TypeScript

## Features
- Classic Tetris gameplay
- Next piece preview
- Score and level tracking
- Keyboard controls

## Setup & Run
\`\`\`bash
npm install
npm start
\`\`\`
Visit \`http://localhost:3001\` (configurable).
`,
    description: 'Classic Tetris game built with React and Canvas.',
    technologies: ['React', 'Canvas', 'TypeScript'],
    contributors: ['AI Developer'],
    links: [{ name: 'GitHub', url: '#' }],
    launchCommand: 'npm start --prefix ./apps/tetris', // Example, not actually run
    port: 3001,
  },
  {
    id: 'gomoku',
    name: 'Gomoku AI',
    iconUrl: 'https://picsum.photos/seed/gomoku/40/40', // Placeholder, will be overwritten
    demoGifUrl: 'https://picsum.photos/seed/gomoku-demo/400/300', // Placeholder, will be overwritten
    readmeContent: `
# Gomoku (Five in a Row)

A Python-based Gomoku game with a Pygame GUI and an AI opponent.

## Overview
Play Gomoku against an AI or another player. The AI uses a Minimax algorithm with Alpha-Beta pruning.

## Technologies
- Python
- Pygame
- NumPy

## Features
- Player vs Player mode
- Player vs AI mode
- Adjustable AI difficulty (conceptual)
- Clean Pygame interface

## Setup & Run
\`\`\`bash
pip install pygame numpy
python apps/gomoku/main.py
\`\`\`
Requires Python and Pygame installed.
`,
    description: 'Python Gomoku game with Pygame and AI.',
    technologies: ['Python', 'Pygame', 'AI'],
    contributors: ['AI Developer'],
    links: [{ name: 'Colab', url: '#' }],
    launchCommand: 'python ./apps/gomoku/main.py',
    port: 5001, // Assuming Flask/Django, or just GUI
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe Next.js',
    iconUrl: 'https://picsum.photos/seed/tictactoe/40/40', // Placeholder, will be overwritten
    demoGifUrl: 'https://picsum.photos/seed/tictactoe-demo/400/300', // Placeholder, will be overwritten
    readmeContent: `
# Tic-Tac-Toe

A simple Tic-Tac-Toe game built with Next.js and Tailwind CSS.

## Overview
A modern web implementation of the classic Tic-Tac-Toe game. Features a sleek UI and demonstrates React state management.

## Technologies
- Next.js
- React
- Tailwind CSS
- TypeScript

## Features
- Player vs Player gameplay
- Win detection
- Reset game functionality
- Responsive design

## Setup & Run
\`\`\`bash
npm install --prefix ./apps/tic-tac-toe
npm run dev --prefix ./apps/tic-tac-toe
\`\`\`
Visit \`http://localhost:3002\`.
`,
    description: 'Modern Tic-Tac-Toe with Next.js and Tailwind CSS.',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    launchCommand: 'npm run dev --prefix ./apps/tic-tac-toe',
    port: 3002,
  },
  {
    id: 'chess',
    name: 'WASM Chess Engine',
    iconUrl: 'https://picsum.photos/seed/chess/40/40', // Placeholder, will be overwritten
    demoGifUrl: 'https://picsum.photos/seed/chess-demo/400/300', // Placeholder, will be overwritten
    readmeContent: `
# WASM Chess

A high-performance chess engine compiled to WebAssembly, with a basic JS interface.

## Overview
This project showcases the power of WebAssembly for computationally intensive tasks like chess AI. The core engine is written in Rust.

## Technologies
- Rust
- WebAssembly (WASM)
- JavaScript (for UI)

## Features
- Basic chess logic (move validation)
- Potential for AI integration
- Lightweight and fast

## Setup & Run
(Build steps for Rust to WASM would be here)
Serve the \`index.html\` file from \`apps/chess/web\`.
\`\`\`bash
# (Build Rust to WASM)
# e.g., wasm-pack build ./apps/chess
# (Serve static files)
serve ./apps/chess/web
\`\`\`
Typically served on a static server, e.g., port 8080.
`,
    description: 'High-performance chess engine in WASM.',
    technologies: ['Rust', 'WebAssembly', 'JavaScript'],
    launchCommand: 'serve ./apps/chess/web', // Example, might vary
    port: 8080,
  },
];

export const getProjects = (): Project[] => {
  // In a real app, this would scan /apps directory, read READMEs, etc.
  // For now, we return the mock data.
  // Ensure iconUrl and demoGifUrl are unique for picsum.photos
  return projects.map(p => ({
    ...p,
    iconUrl: `https://picsum.photos/seed/${p.id}-icon/40/40`,
    demoGifUrl: `https://picsum.photos/seed/${p.id}-demo/400/300`
  }));
};
