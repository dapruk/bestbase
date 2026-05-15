interface DataTableErrorProps {
  colSpan: number;
  message: string;
}

export function DataTableError({ colSpan, message }: DataTableErrorProps) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} role="alert">
          {message}
        </td>
      </tr>
    </tbody>
  );
}
