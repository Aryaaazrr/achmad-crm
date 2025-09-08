import { index, restore } from '@/actions/App/Http/Controllers/ProductController';
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
import product, { forceDelete } from '@/routes/product';
import { type BreadcrumbItem } from '@/types';
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
import { ArchiveRestore, ArchiveX, ArrowLeft, ArrowUpDown, ChevronDown } from 'lucide-react';
import * as React from 'react';

export type Product = {
    id_product: number;
    name: string;
    hpp: number;
    margin: number;
    price: number;
    created_at: string;
};

export const columns: ColumnDef<Product>[] = [
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
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="mx-auto flex items-center gap-2">
                Name <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => <div className="text-center capitalize">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'hpp',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="mx-auto flex items-center gap-2">
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
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="mx-auto flex items-center gap-2">
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
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="mx-auto flex items-center gap-2">
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
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="mx-auto flex items-center gap-2">
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
        accessorKey: 'deleted_at',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="mx-auto flex items-center gap-2">
                Deleted At <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('deleted_at'));
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
                            <Link href={restore(product.id_product)} className="flex w-full items-center gap-2">
                                <ArchiveRestore className="h-4 w-4" /> Restore
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: product.index().url,
    },
    {
        title: 'Trash',
        href: product.index().toString(),
    },
];

export default function Product() {
    const { props } = usePage<{ product: Product[] }>();
    const [localProduct, setlocalProduct] = React.useState<Product[]>(props.product);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

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

    React.useEffect(() => {
        setlocalProduct(props.product);
    }, [props.product]);

    const handleDeleteSelected = () => {
        const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id_product);
        if (selectedIds.length === 0) return;

        router.delete(forceDelete(), {
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
            <Head title='Trash Product'></Head>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">Trash Product</h1>
                    <small className="hidden sm:flex text-muted-foreground">View and manage products that have been moved to trash</small>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant={'secondary'} className="cursor-pointer dark:text-white">
                        <Link href={index()}>
                            <ArrowLeft />
                            <span className='hidden sm:flex'>Back</span>
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="cursor-pointer bg-red-700 hover:bg-red-800 text-white"
                                disabled={table.getSelectedRowModel().rows.length === 0}
                            >
                                <ArchiveX />
                                <span className="hidden sm:flex">Delete Permanent</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Yakin hapus product?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini akan menghapus {table.getSelectedRowModel().rows.length} product secara permanen.
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
                </div>
            </div>

            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center gap-2 py-4">
                    <Input
                        placeholder="Search users..."
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
