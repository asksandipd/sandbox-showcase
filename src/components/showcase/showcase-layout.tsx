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
  SidebarRail, // Added SidebarRail
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import ProjectIconDisplay from './project-icon-display';
import ReadmeViewer from './readme-viewer';
import { LayoutGrid, SidebarOpen, SidebarClose, Home, Search, Settings, Moon, Sun } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';


// Helper to manage theme, adapted from typical next-themes setup
const useAppTheme = () => {
  const [mounted, setMounted] = useState(false);
  // const { theme, setTheme } = useTheme(); // This would require next-themes provider in layout.tsx
  // Simplified theme toggle for now if next-themes is not part of the base scaffold
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue('--initial-color-mode');
    if (initialColorValue === 'light' || initialColorValue === 'dark') {
      setCurrentTheme(initialColorValue);
    }
    // In a real setup with next-themes:
    // const storedTheme = localStorage.getItem('theme') || 'dark';
    // setCurrentTheme(storedTheme);
    // document.documentElement.className = storedTheme;
  }, []);
  
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.documentElement.style.setProperty('--initial-color-mode', newTheme);
    // In a real setup with next-themes:
    // setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme: currentTheme, toggleTheme, mounted };
};


const ShowcaseLayout: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [sidebarCompact, setSidebarCompact] = useState(true); // For text in expanded sidebar
  const { theme, toggleTheme, mounted } = useAppTheme();

  // State for controlling SidebarProvider's open/closed status via key and defaultOpen prop
  const [sidebarProviderKey, setSidebarProviderKey] = useState(0);
  const [initialSidebarOpen, setInitialSidebarOpen] = useState(true);


  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleGridProjectSelect = (projectId: string) => {
    setViewMode('detail');
    setSelectedProjectIds([projectId]);
    setInitialSidebarOpen(false); // Request sidebar to start collapsed (thin)
    setSidebarProviderKey(prev => prev + 1); // Force remount of SidebarProvider
    setSidebarCompact(true); // Ensure internal items are compact style
  };

  const handleSidebarProjectSelect = (projectId: string) => {
    setSelectedProjectIds([projectId]);
    // When selecting from sidebar, don't change sidebar's open/closed state
    // It should retain its current global open state (thin or wide)
  };

  const switchToGridView = () => {
    setViewMode('grid');
    setInitialSidebarOpen(true); // Reset for potential next switch to detail
    // setSidebarProviderKey(prev => prev + 1); // Force remount
  };

  const activeProjects = useMemo(() => {
    return projects.filter(p => selectedProjectIds.includes(p.id));
  }, [projects, selectedProjectIds]);


  const renderGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 p-6 md:p-10 max-w-6xl mx-auto place-items-center">
      {projects.map((project) => (
        <ProjectIconDisplay
          key={project.id}
          project={project}
          onClick={handleGridProjectSelect} // Use specific handler for grid clicks
          sizeClasses="w-16 h-16 md:w-20 md:h-20"
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
    <SidebarProvider key={sidebarProviderKey} defaultOpen={initialSidebarOpen}>
      <div className="flex h-screen bg-background text-foreground">
        {viewMode === 'detail' && (
          <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-lg">
            <SidebarHeader className="p-2 flex justify-between items-center">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                  <Home size={24} className="text-primary" />
                  <h1 className="text-xl font-semibold">Sandbox Showcase</h1>
              </div>
              {/* SidebarTrigger is usually for expanding/collapsing the SidebarProvider state.
                  It's hidden when collapsible=icon and sidebar is collapsed by SidebarRail.
                  The SidebarRail itself handles toggling the SidebarProvider state.
              */}
              <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
            </SidebarHeader>
            
            {/* Button to toggle compact/expanded list text *within* an open (16rem) sidebar */}
            <div className="p-2 group-data-[collapsible=icon]:hidden"> {/* Hidden if sidebar is icon-only (3rem) */}
              <Button variant="ghost" onClick={() => setSidebarCompact(!sidebarCompact)} className="w-full justify-start">
                {sidebarCompact ? <SidebarOpen size={18} className="mr-2"/> : <SidebarClose size={18} className="mr-2"/>}
                {sidebarCompact ? "Expand List" : "Compact List"}
              </Button>
            </div>

            <SidebarContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                      <ProjectIconDisplay
                          project={project}
                          onClick={handleSidebarProjectSelect} // Use specific handler for sidebar clicks
                          isActive={selectedProjectIds.includes(project.id)}
                          // If sidebar is globally collapsed (initialSidebarOpen=false), items must be compact.
                          // If sidebar is globally open (initialSidebarOpen=true), items respect sidebarCompact toggle.
                          isCompact={!initialSidebarOpen || sidebarCompact}
                          sizeClasses="w-8 h-8"
                      />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2 border-t border-sidebar-border">
              <Button variant="ghost" onClick={switchToGridView} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
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
              <Button variant="ghost" disabled className="w-full justify-start group-data-[collapsible=icon]:justify-center">
                <Search size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">Search</span>
              </Button>
              <Button variant="ghost" disabled className="w-full justify-start group-data-[collapsible=icon]:justify-center">
                <Settings size={18} className="mr-2 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Button>
            </SidebarFooter>
            <SidebarRail /> {/* Added SidebarRail for expanding a collapsed icon sidebar */}
          </Sidebar>
        )}
        
        <SidebarInset className={cn("flex-1 overflow-auto", viewMode === 'grid' && "w-full")}>
          {viewMode === 'grid' ? renderGrid() : renderDetailView()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ShowcaseLayout;