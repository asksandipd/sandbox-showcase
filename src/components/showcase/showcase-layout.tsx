"use client";

import type { Project } from '@/types/project';
import { getProjects } from '@/data/mock-projects';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import ProjectIconDisplay from './project-icon-display';
import ReadmeViewer from './readme-viewer';
import { LayoutGrid, SidebarOpen, SidebarClose, Home, Search, Settings, Moon, Sun } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed for theme toggling

// Helper to manage theme, adapted from typical next-themes setup
const useAppTheme = () => {
  const [mounted, setMounted] = useState(false);
  // const { theme, setTheme } = useTheme(); // This would require next-themes provider in layout.tsx
  // Simplified theme toggle for now if next-themes is not part of the base scaffold
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    setMounted(true);
    // In a real setup with next-themes:
    // const storedTheme = localStorage.getItem('theme') || 'dark';
    // setCurrentTheme(storedTheme);
    // document.documentElement.className = storedTheme;
  }, []);
  
  const toggleTheme = () => {
    // setTheme(theme === 'dark' ? 'light' : 'dark');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    // This is a simplified toggle. `next-themes` handles this better.
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme: currentTheme, toggleTheme, mounted };
};


const ShowcaseLayout: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid'); // grid or detail (sidebar + main content)
  const [sidebarCompact, setSidebarCompact] = useState(true);
  const { theme, toggleTheme, mounted } = useAppTheme();


  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleProjectSelect = (projectId: string) => {
    setViewMode('detail');
    // For multi-app selection:
    // setSelectedProjectIds(prev => 
    //   prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    // );
    // For single selection for now:
    setSelectedProjectIds([projectId]);
  };

  const activeProjects = useMemo(() => {
    return projects.filter(p => selectedProjectIds.includes(p.id));
  }, [projects, selectedProjectIds]);


  const renderGrid = () => (
    <div className="flex flex-wrap gap-6 justify-center p-6 md:p-10">
      {projects.map((project) => (
        <ProjectIconDisplay
          key={project.id}
          project={project}
          onClick={handleProjectSelect}
          sizeClasses="w-16 h-16 md:w-20 md:h-20" // Larger icons for grid view
        />
      ))}
    </div>
  );

  const renderDetailView = () => (
    <ScrollArea className="h-full p-2 md:p-6">
      {activeProjects.length > 0 ? (
        activeProjects.map(project => <ReadmeViewer key={project.id} project={project} />)
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <LayoutGrid size={64} className="mb-4" />
          <p className="text-xl">Select a project to view details.</p>
        </div>
      )}
    </ScrollArea>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar collapsible={viewMode === 'detail' ? "icon" : "none"} className="border-r border-sidebar-border shadow-lg">
          <SidebarHeader className="p-2 flex justify-between items-center">
             <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Home size={24} className="text-primary" />
                <h1 className="text-xl font-semibold">Sandbox Showcase</h1>
            </div>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </SidebarHeader>
          
          {viewMode === 'detail' && (
            <div className="p-2 group-data-[collapsible=icon]:hidden">
              <Button variant="ghost" onClick={() => setSidebarCompact(!sidebarCompact)} className="w-full justify-start">
                {sidebarCompact ? <SidebarOpen size={18} className="mr-2"/> : <SidebarClose size={18} className="mr-2"/>}
                {sidebarCompact ? "Expand List" : "Compact List"}
              </Button>
            </div>
          )}

          <SidebarContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                    <ProjectIconDisplay
                        project={project}
                        onClick={handleProjectSelect}
                        isActive={selectedProjectIds.includes(project.id)}
                        isCompact={viewMode === 'grid' || (viewMode === 'detail' && sidebarCompact)}
                        sizeClasses="w-8 h-8"
                    />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-sidebar-border">
            <Button variant="ghost" onClick={() => setViewMode('grid')} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <LayoutGrid size={18} className="mr-2 group-data-[collapsible=icon]:mr-0"/> 
              <span className="group-data-[collapsible=icon]:hidden">Grid View</span>
            </Button>
            {mounted && (
              <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
                {theme === 'dark' ? <Sun size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" /> : <Moon size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" />}
                <span className="group-data-[collapsible=icon]:hidden">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </Button>
            )}
            {/* Placeholder for Search and Settings */}
            <Button variant="ghost" disabled className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <Search size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" />
              <span className="group-data-[collapsible=icon]:hidden">Search</span>
            </Button>
             <Button variant="ghost" disabled className="w-full justify-start group-data-[collapsible=icon]:justify-center">
              <Settings size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1 overflow-auto">
          {viewMode === 'grid' ? renderGrid() : renderDetailView()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ShowcaseLayout;
