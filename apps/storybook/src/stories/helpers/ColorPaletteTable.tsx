/**
 * @file Color Palette Table component for displaying color palette information
 *   in the Introduction story. Uses DataTable to render color data with
 *   swatches for light and dark mode colors.
 */

"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "@convergence/ui/components";

/** Color palette data structure. */
interface ColorPaletteData {
  /** Color name */
  color: string;
  /** Hex color value for light mode */
  lightMode: string;
  /** Hex color value for dark mode */
  darkMode: string;
  /** Usage description */
  usage: string;
}

/** Color palette data. */
const colorPaletteData: ColorPaletteData[] = [
  {
    color: "Primary",
    lightMode: "#7c3aed",
    darkMode: "#8b5cf6",
    usage: "Primary actions, accents",
  },
  {
    color: "Indigo",
    lightMode: "#6366f1",
    darkMode: "#818cf8",
    usage: "Background orbs, highlights",
  },
  {
    color: "Purple",
    lightMode: "#a855f7",
    darkMode: "#c084fc",
    usage: "Gradient accents",
  },
  {
    color: "Blue",
    lightMode: "#3b82f6",
    darkMode: "#60a5fa",
    usage: "Information, links",
  },
  {
    color: "Pink",
    lightMode: "#ec4899",
    darkMode: "#f472b6",
    usage: "Destructive actions",
  },
];

/** Column definitions for the color palette table. */
const columns: ColumnDef<ColorPaletteData>[] = [
  {
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
  },
  {
    accessorKey: "lightMode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Light Mode" />
    ),
    cell: ({ row }) => {
      const color = row.getValue("lightMode") as string;
      return (
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded border border-border"
            style={{ backgroundColor: color }}
          />
          <code className="text-sm">{color}</code>
        </div>
      );
    },
  },
  {
    accessorKey: "darkMode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dark Mode" />
    ),
    cell: ({ row }) => {
      const color = row.getValue("darkMode") as string;
      return (
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded border border-border"
            style={{ backgroundColor: color }}
          />
          <code className="text-sm">{color}</code>
        </div>
      );
    },
  },
  {
    accessorKey: "usage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usage" />
    ),
  },
];

/**
 * Color Palette Table component.
 *
 * Displays the color palette information in a data table format with color
 * swatches for visual reference.
 *
 * @returns Color palette table component
 */
export function ColorPaletteTable() {
  return <DataTable columns={columns} data={colorPaletteData} />;
}
