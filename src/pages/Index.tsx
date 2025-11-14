import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Welcome to your new project</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
          Let's Build Something
          <span className="block text-accent mt-2">Amazing Together</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your blank canvas is ready. Start creating, iterating, and bringing your ideas to life with a solid foundation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="group">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
