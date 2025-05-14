
import ShowcaseLayout from '@/components/showcase/showcase-layout';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="py-4 px-6 text-center border-b border-border shadow-sm">
        <h1 className="text-3xl font-bold text-primary">Sandbox App Hub</h1>
      </header>
      <div className="flex-1 overflow-hidden"> {/* Container for ShowcaseLayout */}
        <ShowcaseLayout />
      </div>
    </div>
  );
}
