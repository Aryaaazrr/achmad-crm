import { bulkDestroy, create, destroy, edit } from '@/actions/App/Http/Controllers/LeadsController';
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
import leads from '@/routes/leads';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
import { ArrowUpDown, Ban, CheckCircle2Icon, ChevronDown, Handshake, LoaderIcon, PencilLine, PhoneCall, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

type User = {
    id: number;
    name: string;
};

type Leads = {
    id_leads: number;
    name: string;
    contact: string;
    address: string;
    needs: string;
    status: 'new' | 'contacted' | 'negotiation' | 'deal' | 'cancel';
    id_user: number;
    created_at: string;
    updated_at: string;
    user?: User;
};

type Auth = {
    permissions: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: leads.index().url,
    },
];

export default function Leads({ auth }: { auth: Auth }) {
    const { props } = usePage<{ leads: Leads[] }>();
    const [localLeads, setlocalLeads] = React.useState<Leads[]>(props.leads);
    const canCreate = auth.permissions.includes('leads-create');

    React.useEffect(() => {
        setlocalLeads(props.leads);
    }, [props.leads]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const columns: ColumnDef<Leads>[] = [
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
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Name <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="text-center capitalize">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'contact',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Contact <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                let value = row.getValue('contact') as string;

                value = value?.toString().replace(/\D/g, '');

                if (value.startsWith('0')) {
                    value = '+62' + value.slice(1);
                }

                const formatted = value.replace(/(\+62)(\d{3})(\d{4})(\d+)/, '$1-$2-$3-$4');

                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            accessorKey: 'address',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Address <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="text-center capitalize">{row.getValue('address')}</div>,
        },
        {
            accessorKey: 'needs',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Needs <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="text-center capitalize">{row.getValue('needs')}</div>,
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
                        {row.original.status === 'deal' ? (
                            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                        ) : row.original.status === 'contacted' ? (
                            <PhoneCall className="text-emerald-500 dark:text-emerald-400" />
                        ) : row.original.status === 'negotiation' ? (
                            <Handshake className="text-amber-500 dark:text-amber-400" />
                        ) : row.original.status === 'cancel' ? (
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
                const leads = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2">⋮</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={edit(leads.id_leads)} className="flex w-full items-center gap-2">
                                    <PencilLine className="h-4 w-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            {canCreate && (
                                <DropdownMenuItem asChild>
                                    <Link href={destroy(leads.id_leads)} className="flex w-full items-center gap-2">
                                        <Trash2 className="h-4 w-4" /> Delete
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
        data: localLeads,
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
        const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id_leads);
        if (selectedIds.length === 0) return;

        router.delete(bulkDestroy(), {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setlocalLeads((prev) => prev.filter((leads) => !selectedIds.includes(leads.id_leads)));
                setRowSelection({});
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads"></Head>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">Leads Data</h1>
                    <small className="hidden text-muted-foreground sm:flex">List of all registered leads in the system</small>
                </div>
                <div className="flex gap-2">
                    {canCreate && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-red-700 text-white hover:bg-red-800" disabled={table.getSelectedRowModel().rows.length === 0}>
                                    <Trash2 />
                                    <span className="hidden sm:flex">Delete</span>
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
                            <Link href={create()}>
                                <Plus />
                                <span className="hidden sm:flex">Create</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Search leads..."
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
