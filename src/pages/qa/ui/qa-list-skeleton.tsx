export function QaListSkeleton() {
  return (
    <div className="flex flex-col gap-8.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`question-skeleton-${index}`}
          className="h-55 w-full animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}
