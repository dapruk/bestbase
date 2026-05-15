interface DataTableEmptyProps {
  colSpan: number;
}

export function DataTableEmpty({ colSpan }: DataTableEmptyProps) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan}>Tidak ada data.</td>
      </tr>
    </tbody>
  );
}
