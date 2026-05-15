interface ConfirmDialogProps {
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}

export function ConfirmDialog({
  cancelLabel = 'Batal',
  confirmLabel = 'Lanjutkan',
  description,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div aria-modal="true" role="dialog">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      <button onClick={onCancel} type="button">
        {cancelLabel}
      </button>
      <button onClick={onConfirm} type="button">
        {confirmLabel}
      </button>
    </div>
  );
}
