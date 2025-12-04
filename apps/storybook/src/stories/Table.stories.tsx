import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  GlassTable,
  GlassTableHeader,
  GlassTableBody,
  GlassTableFooter,
  GlassTableRow,
  GlassTableHead,
  GlassTableCell,
  GlassTableCaption,
} from "@convergence/ui/components";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Table component for displaying structured data.",
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Table Stories
export const BaseSimple: Story = {
  render: (_args) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const BaseFull: Story = {
  render: (_args) => (
    <Table>
      <TableCaption>A list of users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total: 3 users</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Glass Table Stories
export const GlassSimple: Story = {
  render: (_args) => (
    <GlassTable>
      <GlassTableHeader>
        <GlassTableRow>
          <GlassTableHead>Name</GlassTableHead>
          <GlassTableHead>Status</GlassTableHead>
          <GlassTableHead>Role</GlassTableHead>
        </GlassTableRow>
      </GlassTableHeader>
      <GlassTableBody>
        <GlassTableRow>
          <GlassTableCell>John Doe</GlassTableCell>
          <GlassTableCell>Active</GlassTableCell>
          <GlassTableCell>Admin</GlassTableCell>
        </GlassTableRow>
        <GlassTableRow>
          <GlassTableCell>Jane Smith</GlassTableCell>
          <GlassTableCell>Active</GlassTableCell>
          <GlassTableCell>User</GlassTableCell>
        </GlassTableRow>
      </GlassTableBody>
    </GlassTable>
  ),
};

export const GlassWithGlow: Story = {
  render: (_args) => (
    <GlassTable glow>
      <GlassTableHeader>
        <GlassTableRow>
          <GlassTableHead>Name</GlassTableHead>
          <GlassTableHead>Status</GlassTableHead>
          <GlassTableHead>Role</GlassTableHead>
        </GlassTableRow>
      </GlassTableHeader>
      <GlassTableBody>
        <GlassTableRow>
          <GlassTableCell>John Doe</GlassTableCell>
          <GlassTableCell>Active</GlassTableCell>
          <GlassTableCell>Admin</GlassTableCell>
        </GlassTableRow>
        <GlassTableRow>
          <GlassTableCell>Jane Smith</GlassTableCell>
          <GlassTableCell>Active</GlassTableCell>
          <GlassTableCell>User</GlassTableCell>
        </GlassTableRow>
      </GlassTableBody>
    </GlassTable>
  ),
};

export const GlassFull: Story = {
  render: (_args) => (
    <GlassTable glow>
      <GlassTableCaption>A list of users</GlassTableCaption>
      <GlassTableHeader>
        <GlassTableRow>
          <GlassTableHead>Name</GlassTableHead>
          <GlassTableHead>Email</GlassTableHead>
          <GlassTableHead>Status</GlassTableHead>
        </GlassTableRow>
      </GlassTableHeader>
      <GlassTableBody>
        <GlassTableRow>
          <GlassTableCell>John Doe</GlassTableCell>
          <GlassTableCell>john@example.com</GlassTableCell>
          <GlassTableCell>Active</GlassTableCell>
        </GlassTableRow>
        <GlassTableRow>
          <GlassTableCell>Jane Smith</GlassTableCell>
          <GlassTableCell>jane@example.com</GlassTableCell>
          <GlassTableCell>Active</GlassTableCell>
        </GlassTableRow>
        <GlassTableRow>
          <GlassTableCell>Bob Johnson</GlassTableCell>
          <GlassTableCell>bob@example.com</GlassTableCell>
          <GlassTableCell>Inactive</GlassTableCell>
        </GlassTableRow>
      </GlassTableBody>
      <GlassTableFooter>
        <GlassTableRow>
          <GlassTableCell colSpan={3}>Total: 3 users</GlassTableCell>
        </GlassTableRow>
      </GlassTableFooter>
    </GlassTable>
  ),
};

// Comparison Story
export const BaseVsGlass: Story = {
  render: (_args) => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Base Table</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Glass Table</h3>
        <GlassTable glow>
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableHead>Name</GlassTableHead>
              <GlassTableHead>Status</GlassTableHead>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            <GlassTableRow>
              <GlassTableCell>John Doe</GlassTableCell>
              <GlassTableCell>Active</GlassTableCell>
            </GlassTableRow>
          </GlassTableBody>
        </GlassTable>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};
