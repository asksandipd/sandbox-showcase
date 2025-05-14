import type { Project } from '@/types/project';

const projects: Project[] = [
  {
    id: 'tetris',
    name: 'Tetris',
    iconUrl: '/apps/tetris/icon.png',
    readmeContent: `# Tetris

A classic Tetris game. Implementation coming soon!`,
    description: 'Classic Tetris game.',
    technologies: ['JavaScript'],
    contributors: ['AI Developer'],
    links: [],
    launchCommand: 'npm start --prefix ./apps/tetris',
    port: 3001,
  },
  {
    id: 'chess',
    name: 'Chess',
    iconUrl: '/apps/chess/icon.png',
    readmeContent: `# Chess

A classic Chess game. Implementation coming soon!`,
    description: 'Classic Chess game.',
    technologies: ['JavaScript'],
    contributors: ['AI Developer'],
    links: [],
    launchCommand: 'npm start --prefix ./apps/chess', // Assuming node/JS project for now
    port: 3002,
  },
  {
    id: 'gomoku',
    name: 'Gomoku',
    iconUrl: '/apps/gomoku/icon.png',
    readmeContent: `# Gomoku

A classic Gomoku game. Implementation coming soon!`,
    description: 'Classic Gomoku game.',
    technologies: ['JavaScript'],
    contributors: ['AI Developer'],
    links: [],
    launchCommand: 'npm start --prefix ./apps/gomoku', // Assuming node/JS project for now
    port: 3003,
  },
];

export const getProjects = (): Project[] => {
  // In a real app, this would scan /apps directory, read READMEs, etc.
  // For now, we return the hardcoded mock data with local paths.
  return projects;
};
