export function ProjectsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`projects-skeleton-${index}`}
          className="h-[300px] w-[273px] shrink-0 animate-pulse rounded-[var(--radius-lg)] bg-muted"
        />
      ))}
    </div>
  );
}