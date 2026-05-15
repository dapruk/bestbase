interface EmptyStateProps {
  description?: string;
  title?: string;
}

export function EmptyState({
  description,
  title = 'Belum ada data',
}: EmptyStateProps) {
  return (
    <div>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
