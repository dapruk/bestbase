import { getErrorMessage } from '@/shared/utils/error';

interface BbaseDataTableErrorProps {
  error: unknown;
}

export function BbaseDataTableError({ error }: BbaseDataTableErrorProps) {
  return (
    <div className="rounded-md border border-destructive/30 p-8 text-center text-destructive text-sm">
      {getErrorMessage(error)}
    </div>
  );
}
