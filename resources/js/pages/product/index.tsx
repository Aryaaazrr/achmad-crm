import { bulkDestroy, create, destroy, edit, showDeleted } from '@/actions/App/Http/Controllers/ProductController';
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
import product from '@/routes/product';
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
import { ArrowUpDown, ChevronDown, PencilLine, Plus, Recycle, Trash2 } from 'lucide-react';
import * as React from 'react';

type Product = {
    id_product: number;
    name: string;
    hpp: number;
    margin: number;
    price: number;
    created_at: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: product.index().url,
    },
];

export default function Product() {
    const { props } = usePage<{ product: Product[] }>();
    const [localProduct, setlocalProduct] = React.useState<Product[]>(props.product);

    React.useEffect(() => {
        setlocalProduct(props.product);
    }, [props.product]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const columns: ColumnDef<Product>[] = [
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
            accessorKey: 'hpp',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Hpp <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const value = row.getValue('hpp') as number;
                const formatted = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(value);
                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            accessorKey: 'margin',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Margin <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const value = parseFloat(row.getValue('margin'));
                const formatted = `${value}%`;
                return <div className="text-center">{formatted}</div>;
            },
        },
        {
            accessorKey: 'price',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="mx-auto flex items-center gap-2"
                >
                    Price <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => {
                const value = row.getValue('price') as number;
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
                const product = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2">⋮</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={edit(product.id_product)} className="flex w-full items-center gap-2">
                                    <PencilLine className="h-4 w-4" /> Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={destroy(product.id_product)} className="flex w-full items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: localProduct,
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
        const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id_product);
        if (selectedIds.length === 0) return;

        router.delete(bulkDestroy(), {
            data: { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => {
                setlocalProduct((prev) => prev.filter((product) => !selectedIds.includes(product.id_product)));
                setRowSelection({});
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product"></Head>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">Product Data</h1>
                    <small className="hidden sm:flex text-muted-foreground">List of all registered product in the system</small>
                </div>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-700 hover:bg-red-800 text-white" disabled={table.getSelectedRowModel().rows.length === 0}>
                                <Trash2 />
                                <span className="hidden sm:flex">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you delete {table.getSelectedRowModel().rows.length} products?</AlertDialogTitle>
                                <AlertDialogDescription>The products will be deleted and can still be restored.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700">
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button asChild className="cursor-pointer bg-amber-500 hover:bg-amber-600 dark:text-white">
                        <Link href={showDeleted()}>
                            <Recycle />
                            <span className="hidden sm:flex">Recovery</span>
                        </Link>
                    </Button>
                    <Button asChild className="cursor-pointer dark:text-white">
                        <Link href={create()}>
                            <Plus />
                            <span className="hidden sm:flex">Create</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center gap-2 py-4">
                    <Input
                        placeholder="Search product..."
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
