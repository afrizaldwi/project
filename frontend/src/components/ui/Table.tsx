import React from "react";

interface TableTextProps {
  children: React.ReactNode;
}

export const TableHead = ({ children }: TableTextProps) => (
  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
    {children}
  </th>
);

export const TableCell = ({ children }: TableTextProps) => (
  <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
);
