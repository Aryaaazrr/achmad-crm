import ProjectController, { index } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import project from '@/routes/project';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calculator,
    CheckCircle,
    FileText,
    LoaderCircle,
    MapPin,
    Package,
    Phone,
    Plus,
    Save,
    ShoppingCart,
    Target,
    Trash2,
    User,
} from 'lucide-react';
import React from 'react';

interface Lead {
    id_leads: number;
    name: string;
    contact: string;
    address: string;
    needs: string;
}

interface Product {
    id_product: number;
    name: string;
    price: number;
}

interface ProductDetail {
    quantity: number;
    price: number;
    subtotal: number;
}

interface Project {
    id_project: number;
    id_lead: number;
    total_price: number;
    status: string;
}

interface Props {
    project: Project;
    leads: Lead[];
    products: Product[];
    detailProducts: { [key: number]: ProductDetail };
    auth: Auth;
}

type Auth = {
    roles: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project',
        href: project.index().url,
    },
    {
        title: 'Edit',
        href: project.index().toString(),
    },
];

export default function ProjectEdit({ project, leads, products, detailProducts, auth }: Props) {
    const [selectedLead] = React.useState(project.id_lead.toString());
    const [selectedLeadData, setSelectedLeadData] = React.useState<Lead | null>(null);
    const [productDetails, setProductDetails] = React.useState<{ [key: number]: ProductDetail }>(detailProducts);
    const isManager = auth.roles.includes('manager');

    React.useEffect(() => {
        const lead = leads.find((l) => l.id_leads.toString() === selectedLead);
        setSelectedLeadData(lead || null);
    }, [selectedLead, leads]);

    const handleProductChange = (id: number, field: 'quantity' | 'price', value: number) => {
        setProductDetails((prev) => {
            const detail = prev[id] || { quantity: 1, price: 0, subtotal: 0 };
            const updated = {
                ...prev,
                [id]: {
                    ...detail,
                    [field]: value,
                    subtotal: field === 'quantity' ? value * detail.price : detail.quantity * value,
                },
            };
            return updated;
        });
    };

    const removeProduct = (productId: number) => {
        setProductDetails((prev) => {
            const newDetails = { ...prev };
            delete newDetails[productId];
            return newDetails;
        });
    };

    const addProduct = (product: Product) => {
        setProductDetails((prev) => ({
            ...prev,
            [product.id_product]: {
                quantity: 1,
                price: Math.floor(product.price),
                subtotal: Math.floor(product.price),
            },
        }));
    };

    const totalPrice = Object.values(productDetails).reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems = Object.values(productDetails).reduce((sum, item) => sum + item.quantity, 0);

    const selectedProducts = products.filter((p) => productDetails[p.id_product]);
    const availableProducts = products.filter((p) => !productDetails[p.id_product]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project"></Head>
            {/* Header */}
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-xl font-black">Edit Project</h1>
                    <p className="text-sm text-muted-foreground">Project ID: #{project.id_project}</p>
                </div>
                <Button asChild variant={'secondary'} className="cursor-pointer dark:text-white">
                    <Link href={index()}>
                        <ArrowLeft />
                        <span className="hidden sm:flex">Back</span>
                    </Link>
                </Button>
            </div>

            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Form {...ProjectController.update.form(project.id_project)} className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
                        {({ processing }) => (
                            <>
                                {/* Left Column - Main Configuration */}
                                <div className="col-span-1 space-y-4 lg:col-span-2">
                                    {/* Lead Selection */}
                                    <Card className="shadow-sm transition-shadow hover:shadow-md">
                                        <CardHeader className="py-4">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <div className="rounded-lg bg-blue-100 p-2">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                </div>
                                                Select Lead Customer
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Lead Details Preview */}
                                            {selectedLeadData && (
                                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-card dark:bg-card">
                                                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-300">
                                                        <FileText className="h-4 w-4 text-blue-600 dark:text-primary" />
                                                        Customer Details
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                        <div className="flex items-start gap-2">
                                                            <User className="mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-300" />
                                                            <div>
                                                                <div className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-300">
                                                                    Name
                                                                </div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-50">
                                                                    {selectedLeadData.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <Phone className="mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-300" />
                                                            <div>
                                                                <div className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-300">
                                                                    Contact
                                                                </div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-50">
                                                                    {selectedLeadData.contact}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-300" />
                                                            <div>
                                                                <div className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-300">
                                                                    Address
                                                                </div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-50">
                                                                    {selectedLeadData.address}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <Target className="mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-300" />
                                                            <div>
                                                                <div className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-300">
                                                                    Needs
                                                                </div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-50">
                                                                    {selectedLeadData.needs}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <input type="hidden" name="id_lead" value={selectedLeadData ? selectedLeadData.id_leads : ''} />

                                    {/* Products Configuration */}
                                    <Card className="shadow-sm transition-shadow hover:shadow-md">
                                        <CardHeader className="py-4">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <div className="rounded-lg bg-green-100 p-2">
                                                    <Package className="h-4 w-4 text-green-600" />
                                                </div>
                                                List Products Selected
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {selectedProducts.length > 0 ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-300">Selected Products</h4>
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                            {selectedProducts.length} products
                                                        </Badge>
                                                    </div>

                                                    <ScrollArea className="h-[300px]">
                                                        <div className="space-y-3">
                                                            {selectedProducts.map((product, index) => (
                                                                <div
                                                                    key={product.id_product}
                                                                    className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-muted-foreground dark:bg-card"
                                                                >
                                                                    <div className="mb-3 flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
                                                                                {index + 1}
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-medium text-gray-900 dark:text-gray-50">
                                                                                    {product.name}
                                                                                </h5>
                                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                                    Base price: {formatCurrency(product.price)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removeProduct(product.id_product)}
                                                                            className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                                        <div className="col-span-1">
                                                                            <Label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-200">
                                                                                Quantity
                                                                            </Label>
                                                                            <Input
                                                                                type="number"
                                                                                min={1}
                                                                                value={productDetails[product.id_product]?.quantity || 1}
                                                                                onChange={(e) =>
                                                                                    handleProductChange(
                                                                                        product.id_product,
                                                                                        'quantity',
                                                                                        Number(e.target.value),
                                                                                    )
                                                                                }
                                                                                className="text-sm"
                                                                            />
                                                                        </div>
                                                                        <div className="">
                                                                            <Label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-200">
                                                                                Unit Price
                                                                            </Label>
                                                                            <Input
                                                                                type="number"
                                                                                min={0}
                                                                                value={productDetails[product.id_product]?.price || 0}
                                                                                onChange={(e) =>
                                                                                    handleProductChange(
                                                                                        product.id_product,
                                                                                        'price',
                                                                                        Number(e.target.value),
                                                                                    )
                                                                                }
                                                                                className="text-sm"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-200">
                                                                                Subtotal
                                                                            </Label>
                                                                            <div className="rounded-md border bg-gray-50 px-3 py-2 text-sm font-semibold text-green-600 dark:bg-card">
                                                                                {formatCurrency(productDetails[product.id_product]?.subtotal || 0)}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Hidden inputs */}
                                                                    <input
                                                                        type="hidden"
                                                                        name={`products[${index}][id_product]`}
                                                                        value={product.id_product}
                                                                    />
                                                                    <input
                                                                        type="hidden"
                                                                        name={`products[${index}][quantity]`}
                                                                        value={productDetails[product.id_product]?.quantity || 1}
                                                                    />
                                                                    <input
                                                                        type="hidden"
                                                                        name={`products[${index}][price]`}
                                                                        value={productDetails[product.id_product]?.price || product.price}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            ) : (
                                                <div className="rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
                                                    <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                                    <h4 className="mb-2 text-lg font-medium text-gray-900">No products selected</h4>
                                                    <p className="mb-4 text-sm text-gray-500">
                                                        Add products to your project from the available options below
                                                    </p>
                                                </div>
                                            )}

                                            {/* Add Products */}
                                            {availableProducts.length > 0 && (
                                                <div className="border-t pt-4">
                                                    <Label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Available Products ({availableProducts.length})
                                                    </Label>
                                                    <ScrollArea className="h-[300px]">
                                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                                                            {availableProducts.map((product) => (
                                                                <Button
                                                                    key={product.id_product}
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => addProduct(product)}
                                                                    className="h-auto justify-start p-3 text-left hover:border-green-300 hover:bg-green-50 dark:hover:border-green-500 dark:hover:bg-green-800"
                                                                >
                                                                    <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                                                                    <div>
                                                                        <div className="text-sm font-medium">{product.name}</div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {formatCurrency(product.price)}
                                                                        </div>
                                                                    </div>
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right Column - Summary Sidebar */}
                                <div className="col-span-1 lg:col-span-1">
                                    <Card className="border-2 p-0 shadow-lg">
                                        <CardHeader className="rounded-t-lg bg-card p-4">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <div className="rounded-lg bg-amber-100 p-2">
                                                    <Calculator className="h-4 w-4 text-amber-600" />
                                                </div>
                                                Project Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                {/* Project Info */}
                                                <div>
                                                    <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Project Info</div>
                                                    <div className="rounded-lg dark:bg-card">
                                                        <div className="font-medium text-gray-900 dark:text-gray-300">
                                                            Project #{project.id_project}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-500">
                                                            Original Amount: {formatCurrency(project.total_price)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Customer Summary */}
                                                <div>
                                                    <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Customer</div>
                                                    {selectedLeadData ? (
                                                        <div className="rounded-lg dark:bg-card">
                                                            <div className="font-medium text-gray-900 dark:text-gray-300">
                                                                {selectedLeadData.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-500">{selectedLeadData.contact}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-lg bg-gray-50 text-sm text-gray-500 dark:bg-card dark:text-gray-300">
                                                            No customer selected
                                                        </div>
                                                    )}
                                                </div>

                                                <Separator />

                                                {/* Products Summary */}
                                                <div>
                                                    <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Products</div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="rounded-lg text-center dark:bg-card">
                                                            <div className="text-xl font-bold text-amber-600">{selectedProducts.length}</div>
                                                            <div className="text-xs text-gray-600 dark:text-gray-500">Types</div>
                                                        </div>
                                                        <div className="rounded-lg text-center dark:bg-card">
                                                            <div className="text-xl font-bold text-blue-600">{totalItems}</div>
                                                            <div className="text-xs text-gray-600">Items</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Total Amount */}
                                                <div>
                                                    <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Total Amount</div>
                                                    <div className="rounded-lg text-center dark:border-card dark:bg-card">
                                                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</div>
                                                        <div className="mt-1 text-xs text-gray-600">Updated Value</div>
                                                        {totalPrice !== Number(project.total_price || 0) && (
                                                            <div className="mt-2 text-xs">
                                                                <span className="text-gray-500">Change: </span>
                                                                <span
                                                                    className={
                                                                        totalPrice > Number(project.total_price || 0)
                                                                            ? 'text-green-600'
                                                                            : 'text-red-600'
                                                                    }
                                                                >
                                                                    {formatCurrency(totalPrice - Number(project.total_price || 0))}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {isManager ? (
                                                    <>
                                                        <Separator />

                                                        {/* Status */}
                                                        <div>
                                                            <Label
                                                                htmlFor="status"
                                                                className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase"
                                                            >
                                                                Project Status
                                                            </Label>
                                                            <Select name="status" defaultValue={project.status}>
                                                                <SelectTrigger className="h-fit">
                                                                    <SelectValue placeholder="-- Select project status --" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="waiting">
                                                                        <div className="flex items-center gap-3 py-1">
                                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100">
                                                                                <CheckCircle className="h-3 w-3 text-yellow-600" />
                                                                            </div>
                                                                            <div className="text-start">
                                                                                <div className="font-medium text-gray-900 dark:text-gray-300">
                                                                                    Waiting Approval
                                                                                </div>
                                                                                <div className="text-xs text-gray-500">Project awaiting approval</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="approved">
                                                                        <div className="flex items-center gap-3 py-1">
                                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                                                            </div>
                                                                            <div className="text-start">
                                                                                <div className="font-medium text-gray-900 dark:text-gray-300">
                                                                                    Approved
                                                                                </div>
                                                                                <div className="text-xs text-gray-500">Project has been approved</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="rejected">
                                                                        <div className="flex items-center gap-3 py-1">
                                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                                                                                <CheckCircle className="h-3 w-3 text-red-600" />
                                                                            </div>
                                                                            <div className="text-start">
                                                                                <div className="font-medium text-gray-900 dark:text-gray-300">
                                                                                    Rejected
                                                                                </div>
                                                                                <div className="text-xs text-gray-500">Project has been rejected</div>
                                                                            </div>
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <input type="hidden" name="status" value={project.status} />
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Submit Button */}
                                    <Card className="mt-4">
                                        <CardContent className="p-4">
                                            <Button
                                                type="submit"
                                                className="h-12 w-full bg-amber-500 text-base font-semibold hover:bg-amber-600 dark:text-white"
                                                disabled={processing || !selectedLead || selectedProducts.length === 0}
                                            >
                                                {processing ? (
                                                    <>
                                                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                        Updating Project...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-5 w-5" />
                                                        Update Project
                                                    </>
                                                )}
                                            </Button>

                                            {(!selectedLead || selectedProducts.length === 0) && (
                                                <div className="mt-2 text-center text-xs text-gray-500">
                                                    {!selectedLead && 'Please select a customer'}
                                                    {!selectedLead && selectedProducts.length === 0 && ' and '}
                                                    {selectedProducts.length === 0 && 'add at least one product'}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
