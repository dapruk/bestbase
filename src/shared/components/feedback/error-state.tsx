interface ErrorStateProps {
  message?: string;
  title?: string;
}

export function ErrorState({
  message,
  title = 'Terjadi kesalahan',
}: ErrorStateProps) {
  return (
    <div role="alert">
      <strong>{title}</strong>
      {message ? <p>{message}</p> : null}
    </div>
  );
}
