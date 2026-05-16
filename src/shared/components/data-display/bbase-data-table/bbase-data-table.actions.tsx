import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import type { BbaseDataTableRowAction } from './bbase-data-table.types';

interface BbaseDataTableActionsProps<TRow> {
  actions: BbaseDataTableRowAction<TRow>[];
  children: React.ReactNode;
  row: TRow;
}

export function BbaseDataTableActions<TRow>({
  actions,
  children,
  row,
}: BbaseDataTableActionsProps<TRow>) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => {
          const disabled = action.disabled?.(row);
          return (
            <DropdownMenuItem
              key={action.label}
              {...(disabled === undefined ? {} : { disabled })}
              {...(action.variant === undefined
                ? {}
                : { variant: action.variant })}
              onClick={() => action.onClick(row)}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
