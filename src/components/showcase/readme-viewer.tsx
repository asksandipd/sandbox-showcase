"use client";

import type { Project } from '@/types/project';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReadmeViewerProps {
  project: Project;
}

// Basic Markdown to HTML (simplified)
const renderMarkdown = (markdown: string) => {
  // In a real app, use react-markdown or similar
  // This is a very basic transformation for demonstration
  const sections = markdown.split(/\\n(#{1,6} .*?)\\n|\\n(\`\`\`[\s\S]*?\`\`\`)\\n/g).filter(Boolean);

  return sections.map((section, index) => {
    if (section.startsWith('#')) {
      const level = section.match(/^#+/)?.[0].length || 1;
      const text = section.replace(/^#+\s*/, '');
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag key={index} className={`font-bold my-2 ${level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg'}`}>{text}</Tag>;
    }
    if (section.startsWith('```')) {
      const code = section.replace(/```(\w*\n)?([\s\S]*?)```/, '$2').trim();
      return (
        <pre key={index} className="bg-muted p-3 rounded-md overflow-x-auto my-2 text-sm">
          <code>{code}</code>
        </pre>
      );
    }
    // Paragraphs split by double newlines
    return section.split('\\n\\n').map((paragraph, pIndex) => (
      <p key={`${index}-${pIndex}`} className="my-2 text-sm leading-relaxed">{paragraph.replace(/\\n/g, ' ')}</p>
    ));
  });
};


const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ project }) => {
  const { toast } = useToast();

  const handleLaunchApp = () => {
    // Actual app launching is complex and platform-dependent.
    // This is a placeholder.
    toast({
      title: "Launch App",
      description: `Simulating launch for ${project.name}. Command: ${project.launchCommand || 'N/A'}. Port: ${project.port || 'N/A'}. This would open in a new terminal and browser tab.`,
    });
    if (project.port) {
      // window.open(`http://localhost:${project.port}`, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-4 shadow-xl bg-card/80 backdrop-blur-md border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold text-primary flex items-center">
          {project.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-1">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1 text-foreground">Technologies:</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm bg-secondary/70 backdrop-blur-sm">{tech}</Badge>
            ))}
          </div>
        </div>

        {project.demoGifUrl && (
          <div className="my-6 rounded-lg overflow-hidden border border-border shadow-md">
            <Image
              src={project.demoGifUrl}
              alt={`${project.name} demo GIF`}
              width={600}
              height={450}
              layout="responsive"
              className="object-contain"
              data-ai-hint="app screenshot"
            />
          </div>
        )}
        
        <h3 className="text-xl font-semibold mt-6 mb-2 text-foreground">README:</h3>
        <ScrollArea className="h-[400px] p-4 rounded-md border border-border/30 bg-background/50">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {renderMarkdown(project.readmeContent)}
          </div>
        </ScrollArea>

        {project.contributors && project.contributors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-1 text-foreground">Contributors:</h3>
            <p className="text-sm text-muted-foreground">{project.contributors.join(', ')}</p>
          </div>
        )}

        {project.links && project.links.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-1 text-foreground">Links:</h3>
            <ul className="list-none p-0">
              {project.links.map((link) => (
                <li key={link.name} className="text-sm">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-primary underline flex items-center"
                  >
                    {link.name} <ExternalLink size={14} className="ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
      <CardFooter>
        {project.launchCommand && (
          <Button onClick={handleLaunchApp} variant="default" className="bg-primary hover:bg-accent text-primary-foreground">
            <Terminal size={18} className="mr-2" /> Launch App
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReadmeViewer;
