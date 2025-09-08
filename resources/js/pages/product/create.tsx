import ProductController, { index } from '@/actions/App/Http/Controllers/ProductController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrencyInput } from '@/hooks/use-currency';
import { usePercentInput } from '@/hooks/use-persen';
import AppLayout from '@/layouts/app-layout';
import product from '@/routes/product';
import {type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Send } from 'lucide-react';

interface Product {
    id_product: number;
    name: string;
    hpp: number;
    margin: number;
}

interface Props {
    product: Product;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product',
        href: product.index().url,
    },
    {
        title: 'Create',
        href: product.index().toString(),
    },
];

export default function ProductCreate({ product }: Props) {
    const hppInput = useCurrencyInput(product?.hpp || 0);
    const marginInput = usePercentInput(product?.margin || 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Create Product'/>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">Create Product</h1>
                    <small className="hidden sm:flex text-muted-foreground">Easily add your product by completing the form below.</small>
                </div>
            </div>
            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Form {...ProductController.store.form()} className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-col space-y-2">
                                    <Label>Product Name</Label>
                                    <Input id="name" type="text" name="name" required autoFocus tabIndex={1} placeholder="Enter this product name" />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>HPP</Label>
                                    <Input
                                        id="hpp_display"
                                        type="text"
                                        value={hppInput.display}
                                        onChange={hppInput.onChange}
                                        required
                                        tabIndex={2}
                                        placeholder="Enter product HPP"
                                    />
                                    <input type="hidden" name="hpp" value={hppInput.raw} />
                                    <InputError message={errors.hpp} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>Margin</Label>
                                    <Input
                                        id="margin_display"
                                        type="text"
                                        value={marginInput.display}
                                        onChange={marginInput.onChange}
                                        required
                                        tabIndex={3}
                                        placeholder="Enter this product margin"
                                    />
                                    <input type="hidden" name="margin" value={marginInput.raw} />
                                    <InputError message={errors.margin} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>Estimated Selling Price</Label>
                                    <div className="rounded-md border bg-muted/30 px-3 py-1">
                                        <span className="text-sm font-medium">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(hppInput.raw * (1 + marginInput.raw / 100))}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Based on HPP + Margin</p>
                                </div>
                                <div className="col-span-1 flex justify-end md:col-span-2 gap-2">
                                    <Button asChild variant={'secondary'} className="cursor-pointer">
                                        <Link href={index()}> <ArrowLeft />Back</Link>
                                    </Button>
                                    <Button type="submit" tabIndex={5} className="cursor-pointer text-white" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        <Send />
                                        Submit
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
