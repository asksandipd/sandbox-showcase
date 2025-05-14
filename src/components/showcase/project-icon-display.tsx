"use client";

import type { Project } from '@/types/project';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectIconDisplayProps {
  project: Project;
  onClick: (projectId: string) => void;
  sizeClasses?: string; // e.g., "w-10 h-10"
  isActive?: boolean;
  isCompact?: boolean; // For sidebar's expanded title view
}

const ProjectIconDisplay: React.FC<ProjectIconDisplayProps> = ({
  project,
  onClick,
  sizeClasses = "w-10 h-10", // Approx 1cm
  isActive = false,
  isCompact = true,
}) => {
  const commonStyles = "flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-in-out overflow-hidden";
  const activeStyles = isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-2 hover:ring-accent";

  if (!isCompact) { // Expanded view for sidebar
    return (
      <button
        onClick={() => onClick(project.id)}
        aria-label={`Select ${project.name}`}
        className={cn(
          "flex items-center w-full p-2 rounded-md text-left transition-colors",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <div className={cn(commonStyles, sizeClasses, "mr-3 flex-shrink-0", activeStyles)}>
          <Image
            src={project.iconUrl}
            alt={`${project.name} icon`}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            data-ai-hint="abstract logo"
          />
        </div>
        <span className="truncate text-sm font-medium">{project.name}</span>
      </button>
    );
  }

  // Compact circle view (grid or compact sidebar)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onClick(project.id)}
          aria-label={project.name}
          className={cn(commonStyles, sizeClasses, activeStyles, "bg-card shadow-md hover:shadow-lg")}
        >
          <Image
            src={project.iconUrl}
            alt={`${project.name} icon`}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            data-ai-hint="tech pattern"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{project.name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ProjectIconDisplay;
