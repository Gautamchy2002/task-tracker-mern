import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Edit,
  Plus,
  Search,
} from "lucide-react";
import axiosinstance from "@/api/axiosinstance";
import AlertPopup from "@/components/AlertPopup/Alert";
import DataTableSkelton from "@/components/tableSkelton/DataTableSkelton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getResponseData } from "@/lib/api-error";
import type { User } from "@/types";
import CreateUser from "./CreateUser";

const Users: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [userList, setUserList] = React.useState<User[]>([]);
  const [editData, setEditData] = React.useState<User | null>(null);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<"success" | "error">(
    "success",
  );

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.name}</p>
          <p className="text-xs text-slate-500">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => (
        <div className="text-slate-600">
          {new Date(row.original.createdAt).toLocaleDateString("en-GB")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.role !== "ADMIN" && (
            <Button
              variant="ghost"
              size="icon"
              title="Update Role"
              onClick={() => {
                setEditData(row.original);
                setOpen(true);
              }}
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: userList,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalItems = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex;
  const startItem = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const getUsers = async () => {
    setLoading(true);

    try {
      const response = await axiosinstance.get("/users", {
        params: { page: 1, limit: 100 },
      });
      const data = getResponseData<{ users: User[] }>(response.data);
      setUserList(data.users || []);
    } catch (error: any) {
      setAlertMessage(
        error?.response?.data?.message || "Unable to fetch user list",
      );
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void getUsers();
  }, []);

  return (
    <div className="min-h-screen rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-950">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage tenant managers and members.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[220px] flex-1 md:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search users..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-11 bg-white pl-9 shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(Boolean(value))
                    }
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {loading ? (
        <DataTableSkelton rows={5} columns={5} />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="transition-colors hover:bg-indigo-50/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-28 text-center text-sm text-slate-500"
                  >
                    No Users Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {userList.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-slate-50/60 p-4 md:flex-row">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Rows per page:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-9 w-20 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm text-slate-600">
                {startItem}-{endItem} of {totalItems}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="w-24 bg-white"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="w-24 bg-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {open && (
        <CreateUser
          open={open}
          setOpen={setOpen}
          getUsers={getUsers}
          editData={editData}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
          setAlertOpen={setAlertOpen}
        />
      )}

      <AlertPopup
        message={alertMessage}
        alertPopupopen={alertOpen}
        setAlertPopupopen={setAlertOpen}
        type={alertType}
      />
    </div>
  );
};

export default Users;
