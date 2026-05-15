interface LoadingStateProps {
  title?: string;
}

export function LoadingState({ title = 'Memuat data' }: LoadingStateProps) {
  return <div role="status">{title}</div>;
}
