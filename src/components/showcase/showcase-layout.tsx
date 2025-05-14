
"use client";

import type { Project } from '@/types/project';
import { getProjects } from '@/data/mock-projects';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import ProjectIconDisplay from './project-icon-display';
import ReadmeViewer from './readme-viewer';
import { LayoutGrid, SidebarOpen, SidebarClose, Home, Search, Settings, Moon, Sun, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 8; // Number of items to load per "page" for infinite scroll, e.g. 1 row of 8

const useAppTheme = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue('--initial-color-mode') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setCurrentTheme(initialColorValue as string);
    document.documentElement.classList.toggle('dark', initialColorValue === 'dark');
    document.documentElement.classList.toggle('light', initialColorValue === 'light');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.documentElement.style.setProperty('--initial-color-mode', newTheme);
  };

  return { theme: currentTheme, toggleTheme, mounted };
};


const ShowcaseLayout: React.FC = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [sidebarCompact, setSidebarCompact] = useState(true);
  const { theme, toggleTheme, mounted } = useAppTheme();

  const [sidebarProviderKey, setSidebarProviderKey] = useState(0);
  const [initialSidebarOpen, setInitialSidebarOpen] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const projectsData = getProjects();
    setAllProjects(projectsData);
    setDisplayedProjects(projectsData.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setHasMore(projectsData.length > ITEMS_PER_PAGE);
  }, []);

  const loadMoreProjects = useCallback(() => {
    if (isLoadingMore || !hasMore || viewMode !== 'grid') return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const nextItemsStart = currentPage * ITEMS_PER_PAGE;
    const nextItemsEnd = nextPage * ITEMS_PER_PAGE;
    
    // Simulate delay for loading
    setTimeout(() => {
      const newProjects = allProjects.slice(nextItemsStart, nextItemsEnd);
      setDisplayedProjects(prev => [...prev, ...newProjects]);
      setCurrentPage(nextPage);
      setHasMore(allProjects.length > nextItemsEnd);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore, currentPage, allProjects, viewMode]);

  useEffect(() => {
    const scrollableElement = scrollContainerRef.current;
    const handleScroll = () => {
      if (scrollableElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
        // Load more when 200px near the bottom
        if (scrollHeight - scrollTop - clientHeight < 200 && !isLoadingMore && hasMore && viewMode === 'grid') {
          loadMoreProjects();
        }
      }
    };

    if (scrollableElement && viewMode === 'grid') {
      scrollableElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLoadingMore, hasMore, loadMoreProjects, viewMode]);


  const handleGridProjectSelect = (projectId: string) => {
    setViewMode('detail');
    setSelectedProjectIds([projectId]);
    setInitialSidebarOpen(false); 
    setSidebarProviderKey(prev => prev + 1); 
    setSidebarCompact(true); 
  };

  const handleSidebarProjectSelect = (projectId: string) => {
    setSelectedProjectIds([projectId]);
  };

  const switchToGridView = () => {
    setViewMode('grid');
    setInitialSidebarOpen(true);
    // Reset displayed projects to initial page for grid view
    setDisplayedProjects(allProjects.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
    setHasMore(allProjects.length > ITEMS_PER_PAGE);
  };

  const activeProjects = useMemo(() => {
    return allProjects.filter(p => selectedProjectIds.includes(p.id));
  }, [allProjects, selectedProjectIds]);


  const renderGrid = () => (
    <div className="flex flex-col items-center w-full"> {/* Wrapper for centering grid and loader */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6 p-6 md:p-10 max-w-7xl w-full place-items-center">
        {displayedProjects.map((project) => (
          <ProjectIconDisplay
            key={project.id} 
            project={project}
            onClick={handleGridProjectSelect}
            sizeClasses="w-16 h-16 md:w-20 md:h-20"
          />
        ))}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!hasMore && displayedProjects.length > 0 && viewMode === 'grid' && (
        <p className="col-span-full text-center text-muted-foreground py-4">No more projects to load.</p>
      )}
       {/* Placeholder if no projects initially and not loading - might not be hit with current logic */}
      {displayedProjects.length === 0 && !isLoadingMore && !hasMore && viewMode === 'grid' && (
         <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
          <LayoutGrid size={64} className="mb-4" />
          <p className="text-xl">No projects found.</p>
        </div>
      )}
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
      {/* Root div for ShowcaseLayout, takes full height from parent */}
      <div className="flex h-full bg-background text-foreground"> 
        {viewMode === 'detail' && (
          <Sidebar collapsible="icon" className="border-r border-sidebar-border shadow-lg">
            <SidebarHeader className="p-2 flex justify-between items-center">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                  <Home size={24} className="text-primary" />
                  <h1 className="text-xl font-semibold">Sandbox Showcase</h1>
              </div>
              <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
            </SidebarHeader>
            
            <div className="p-2 group-data-[collapsible=icon]:hidden">
              <Button variant="ghost" onClick={() => setSidebarCompact(!sidebarCompact)} className="w-full justify-start">
                {sidebarCompact ? <SidebarOpen size={18} className="mr-2"/> : <SidebarClose size={18} className="mr-2"/>}
                {sidebarCompact ? "Expand List" : "Compact List"}
              </Button>
            </div>

            <SidebarContent>
              <SidebarMenu>
                {allProjects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                      <ProjectIconDisplay
                          project={project}
                          onClick={handleSidebarProjectSelect}
                          isActive={selectedProjectIds.includes(project.id)}
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
            <SidebarRail />
          </Sidebar>
        )}
        
        <SidebarInset ref={scrollContainerRef} className={cn("flex-1 overflow-auto", viewMode === 'grid' && "w-full")}>
          {viewMode === 'grid' ? renderGrid() : renderDetailView()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ShowcaseLayout;
