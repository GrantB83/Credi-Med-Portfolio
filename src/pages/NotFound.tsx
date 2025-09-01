import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="space-y-4">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </a>
          <div className="flex justify-center gap-4 text-sm">
            <a href="/about" className="text-muted-foreground hover:text-primary">About</a>
            <a href="/contact" className="text-muted-foreground hover:text-primary">Contact</a>
            <a href="/questionnaire" className="text-muted-foreground hover:text-primary">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
