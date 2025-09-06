interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`loading-spinner ${sizeClasses[size]}`} data-testid="loading-spinner"></div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function LoadingDots({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="loading-dots" data-testid="loading-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function ProcessingBar({ text }: { text?: string }) {
  return (
    <div className="w-full">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full processing-animation rounded-full"></div>
      </div>
      {text && <p className="text-sm text-muted-foreground mt-2 text-center">{text}</p>}
    </div>
  );
}