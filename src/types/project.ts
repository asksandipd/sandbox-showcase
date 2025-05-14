export interface ProjectLink {
  name: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  iconUrl: string;
  demoGifUrl: string;
  readmeContent: string;
  description: string;
  technologies: string[];
  contributors?: string[];
  links?: ProjectLink[];
  launchCommand?: string;
  port?: number;
}
