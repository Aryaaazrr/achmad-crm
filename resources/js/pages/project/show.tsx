import { index } from '@/actions/App/Http/Controllers/ProjectController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Calculator, CheckCircle, FileText, MapPin, Package, Phone, ShoppingCart, Target, User } from 'lucide-react';
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
}

export default function ProjectShow({ project, leads, products, detailProducts }: Props) {
    const [selectedLead] = React.useState(project.id_lead.toString());
    const [selectedLeadData, setSelectedLeadData] = React.useState<Lead | null>(null);
    const [productDetails, setProductDetails] = React.useState<{ [key: number]: ProductDetail }>(detailProducts);

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

    const totalPrice = Object.values(productDetails).reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems = Object.values(productDetails).reduce((sum, item) => sum + item.quantity, 0);

    const selectedProducts = products.filter((p) => productDetails[p.id_product]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusConfig = (statusValue: string) => {
        switch (statusValue) {
            case 'approved':
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: 'bg-green-100 text-green-800 border-green-200',
                    label: 'Approved',
                };
            case 'rejected':
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: 'bg-red-100 text-red-800 border-red-200',
                    label: 'Rejected',
                };
            default:
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    label: 'Waiting Approval',
                };
        }
    };

    const currentStatusConfig = getStatusConfig(project.status);

    return (
        <AppLayout>
            {/* Header */}
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl bg-muted/50 p-4">
                <div>
                    <h1 className="text-xl font-black">Detail Project</h1>
                    <p className="text-sm text-muted-foreground">Project ID: #{project.id_project}</p>
                </div>
                <Button asChild variant={'destructive'} className="cursor-pointer dark:text-white">
                    <Link href={index()}>Back</Link>
                </Button>
            </div>

            <div className="mx-6 space-y-6 pb-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Main Configuration */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Lead Selection */}
                        <Card className="shadow-sm transition-shadow hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    Lead Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Lead Details Preview */}
                                {selectedLeadData && (
                                    <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            Customer Details
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            <div className="flex items-start gap-2">
                                                <User className="mt-0.5 h-4 w-4 text-gray-500" />
                                                <div>
                                                    <div className="text-xs tracking-wide text-gray-500 uppercase">Name</div>
                                                    <div className="font-medium text-gray-900">{selectedLeadData.name}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                                                <div>
                                                    <div className="text-xs tracking-wide text-gray-500 uppercase">Contact</div>
                                                    <div className="font-medium text-gray-900">{selectedLeadData.contact}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                                                <div>
                                                    <div className="text-xs tracking-wide text-gray-500 uppercase">Address</div>
                                                    <div className="font-medium text-gray-900">{selectedLeadData.address}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Target className="mt-0.5 h-4 w-4 text-gray-500" />
                                                <div>
                                                    <div className="text-xs tracking-wide text-gray-500 uppercase">Needs</div>
                                                    <div className="font-medium text-gray-900">{selectedLeadData.needs}</div>
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
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-lg bg-green-100 p-2">
                                        <Package className="h-4 w-4 text-green-600" />
                                    </div>
                                    List Products
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedProducts.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-900">Selected Products</h4>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                {selectedProducts.length} products
                                            </Badge>
                                        </div>

                                        <ScrollArea className="h-[300px] pr-4">
                                            <div className="space-y-3">
                                                {selectedProducts.map((product, index) => (
                                                    <div
                                                        key={product.id_product}
                                                        className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                                                    >
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900">{product.name}</h5>
                                                                    <p className="text-sm text-gray-500">
                                                                        Base price: {formatCurrency(product.price)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-3">
                                                            <div>
                                                                <Label className="mb-1 block text-xs font-medium text-gray-700">Quantity</Label>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    value={productDetails[product.id_product]?.quantity || 1}
                                                                    onChange={(e) =>
                                                                        handleProductChange(product.id_product, 'quantity', Number(e.target.value))
                                                                    }
                                                                    className="text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="mb-1 block text-xs font-medium text-gray-700">Unit Price</Label>
                                                                <Input
                                                                    type="number"
                                                                    min={0}
                                                                    value={productDetails[product.id_product]?.price || 0}
                                                                    onChange={(e) =>
                                                                        handleProductChange(product.id_product, 'price', Number(e.target.value))
                                                                    }
                                                                    className="text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="mb-1 block text-xs font-medium text-gray-700">Subtotal</Label>
                                                                <div className="rounded-md border bg-gray-50 px-3 py-2 text-sm font-semibold text-green-600">
                                                                    {formatCurrency(productDetails[product.id_product]?.subtotal || 0)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Hidden inputs */}
                                                        <input type="hidden" name={`products[${index}][id_product]`} value={product.id_product} />
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
                                        <p className="mb-4 text-sm text-gray-500">Add products to your project from the available options below</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 p-0 shadow-lg">
                            <CardHeader className="rounded-t-lg bg-gradient-to-r from-primary to-blue-700 p-4 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Project Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Project Info */}
                                    <div>
                                        <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Project Info</div>
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <div className="font-medium text-gray-900">Project #{project.id_project}</div>
                                            <div className="text-sm text-gray-600">Original Amount: {formatCurrency(project.total_price)}</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Customer Summary */}
                                    <div>
                                        <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Customer</div>
                                        {selectedLeadData ? (
                                            <div className="rounded-lg bg-blue-50 p-3">
                                                <div className="font-medium text-gray-900">{selectedLeadData.name}</div>
                                                <div className="text-sm text-gray-600">{selectedLeadData.contact}</div>
                                            </div>
                                        ) : (
                                            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">No customer selected</div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Products Summary */}
                                    <div>
                                        <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Products</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-lg bg-green-50 p-3 text-center">
                                                <div className="text-xl font-bold text-green-600">{selectedProducts.length}</div>
                                                <div className="text-xs text-gray-600">Types</div>
                                            </div>
                                            <div className="rounded-lg bg-blue-50 p-3 text-center">
                                                <div className="text-xl font-bold text-blue-600">{totalItems}</div>
                                                <div className="text-xs text-gray-600">Items</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Total Amount */}
                                    <div>
                                        <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Total Amount</div>
                                        <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPrice)}</div>
                                            <div className="mt-1 text-xs text-gray-600">Updated Value</div>
                                            {totalPrice !== Number(project.total_price || 0) && (
                                                <div className="mt-2 text-xs">
                                                    <span className="text-gray-500">Change: </span>
                                                    <span
                                                        className={totalPrice > Number(project.total_price || 0) ? 'text-green-600' : 'text-red-600'}
                                                    >
                                                        {formatCurrency(totalPrice - Number(project.total_price || 0))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Status */}
                                    <div>
                                        <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">Current Status</div>
                                        <div className={`rounded-lg border p-3 ${currentStatusConfig.color} flex items-center gap-2`}>
                                            {currentStatusConfig.icon}
                                            <span className="font-medium">{currentStatusConfig.label}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
