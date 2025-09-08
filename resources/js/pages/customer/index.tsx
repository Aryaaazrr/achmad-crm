import { show } from '@/actions/App/Http/Controllers/CustomerController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, Info, UserCheck, UserX } from 'lucide-react';
import * as React from 'react';

type Lead = {
    id_leads: number;
    name: string;
};

type Customer = {
    id_customer: number;
    id_leads: number;
    status: 'active' | 'non-active';
    created_at: string;
    updated_at: string;
    lead?: Lead;
};

export default function Customer() {
    const { props } = usePage<{ customer: Customer[] }>();
    const [localCustomers, setLocalCustomers] = React.useState<Customer[]>(props.customer);

    React.useEffect(() => {
        setLocalCustomers(props.customer);
    }, [props.customer]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const columns: ColumnDef<Customer>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'customer_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Customer Name <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-center capitalize">
                    {row.original.lead?.name ?? 'Unknown Customer'}
                </div>
            ),
            sortingFn: (rowA, rowB) => {
                const nameA = rowA.original.lead?.name ?? '';
                const nameB = rowB.original.lead?.name ?? '';
                return nameA.localeCompare(nameB);
            },
        },
        {
            accessorKey: 'id_leads',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Lead ID <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="text-center">#{row.getValue('id_leads')}</div>,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Status <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Badge
                        variant="outline"
                        className={`flex gap-1 px-2 py-1 text-xs font-medium [&_svg]:size-3 ${
                            row.original.status === 'active'
                                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                    >
                        {row.original.status === 'active' ? (
                            <UserCheck className="text-green-600 dark:text-green-400" />
                        ) : (
                            <UserX className="text-red-600 dark:text-red-400" />
                        )}
                        {row.original.status === 'active' ? 'Active' : 'Non-Active'}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Created At <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue('created_at'));
                const formatted = new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(date);
                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Updated At <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const date = new Date(row.getValue('updated_at'));
                const formatted = new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(date);
                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const customer = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <span className="text-lg">⋮</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={show(customer.id_customer)} className="flex w-full items-center gap-2 cursor-pointer">
                                    <Info className="h-4 w-4" /> Detail
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: localCustomers,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    const activeCustomers = localCustomers.filter(c => c.status === 'active').length;
    const totalCustomers = localCustomers.length;

    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-xl font-black">Customer Data</h1>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {activeCustomers} Active
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <UserX className="h-3 w-3 mr-1" />
                        {totalCustomers - activeCustomers} Inactive
                    </Badge>
                </div>
            </div>

            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search customers..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(String(e.target.value))}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id.replace('_', ' ')}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
