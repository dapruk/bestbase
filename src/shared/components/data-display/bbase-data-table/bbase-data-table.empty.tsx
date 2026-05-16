interface BbaseDataTableEmptyProps {
  message?: string | undefined;
}

export function BbaseDataTableEmpty({
  message = 'No data found.',
}: BbaseDataTableEmptyProps) {
  return (
    <div className="rounded-md border p-8 text-center text-muted-foreground text-sm">
      {message}
    </div>
  );
}
