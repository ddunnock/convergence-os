interface StoryCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function StoryCanvas({ children, className }: StoryCanvasProps) {
  return (
    <div
      className={`p-6 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
