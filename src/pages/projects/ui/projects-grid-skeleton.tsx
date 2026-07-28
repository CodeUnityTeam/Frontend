export function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fill,minmax(273px,1fr))] md:gap-x-3.5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`project-skeleton-${index}`}
          className="h-[370px] w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}
