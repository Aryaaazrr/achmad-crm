import { bulkDestroy, create, destroy, edit, show } from '@/actions/App/Http/Controllers/ProjectController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Link, router, usePage } from '@inertiajs/react';
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
import { ArrowUpDown, Ban, CheckCircle2Icon, ChevronDown, Info, LoaderIcon, PencilLine, Trash } from 'lucide-react';
import * as React from 'react';

type User = {
    id: number;
    name: string;
};

type Lead = {
    id: number;
    name: string;
};

type Project = {
    id_project: number;
    id_lead: number;
    id_user: number;
    status: 'waiting' | 'approved' | 'rejected';
    total_price: number;
    created_at: string;
    updated_at: string;
    lead?: Lead;
    user?: User;
};

type Auth = {
    permissions: string[];
};

export default function Project({ auth }: { auth: Auth }) {
    const { props } = usePage<{ project: Project[] }>();
    const [localProject, setlocalProject] = React.useState<Project[]>(props.project);
    const canCreate = auth.permissions.includes('project-create');

    React.useEffect(() => {
        setlocalProject(props.project);
    }, [props.project]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const columns: ColumnDef<Project>[] = [
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
            id: 'lead_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Lead Name <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="text-center capitalize">{row.original.lead?.name ?? '-'}</div>,
        },
        {
            id: 'sales_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Sales Name <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="text-center capitalize">{row.original.user?.name ?? '-'}</div>,
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
                    <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3">
                        {row.original.status === 'approved' ? (
                            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                        ) : row.original.status === 'rejected' ? (
                            <Ban className="text-red-500 dark:text-red-400" />
                        ) : (
                            <LoaderIcon />
                        )}
                        {row.original.status}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'total_price',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Total Price <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const value = row.getValue('total_price') as number;
                const formatted = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(value);
                return <div className="text-center">{formatted}</div>;
            },
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
                const project = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2">⋮</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={show(project.id_project)} className="flex w-full items-center gap-2">
                                    <Info className="h-4 w-4" /> Detail
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={edit(project.id_project)} className="flex w-full items-center gap-2">
                                    <PencilLine className="h-4 w-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            {canCreate && (
                                <DropdownMenuItem asChild>
                                    <Link href={destroy(project.id_project)} className="flex w-full items-center gap-2">
                                        <Trash className="h-4 w-4" /> Delete
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: localProject,
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

    const handleDeleteSelected = () => {
        const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id_project);
        if (selectedIds.length === 0) return;

        router.delete(bulkDestroy(), {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setlocalProject((prev) => prev.filter((project) => !selectedIds.includes(project.id_project)));
                setRowSelection({});
            },
        });
    };

    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <h1 className="text-xl font-black">Project Data</h1>
                <div className="flex gap-2">
                    {canCreate && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={table.getSelectedRowModel().rows.length === 0}>
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you delete {table.getSelectedRowModel().rows.length} leads?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        The leads will be deleted permanently and can not be restored again.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700">
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {canCreate && (
                        <Button asChild className="cursor-pointer dark:text-white">
                            <Link href={create()}>Create</Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search data..."
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
                                        {column.id}
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
                                        No results.
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
