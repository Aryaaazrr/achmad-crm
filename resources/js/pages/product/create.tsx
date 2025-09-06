import ProductController, { index } from '@/actions/App/Http/Controllers/ProductController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrencyInput } from '@/hooks/use-currency';
import { usePercentInput } from '@/hooks/use-persen';
import AppLayout from '@/layouts/app-layout';
import { Form, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface Product {
    id_product: number;
    name: string;
    hpp: number;
    margin: number;
}

interface Props {
    product: Product;
}

export default function ProductCreate({ product }: Props) {
    const hppInput = useCurrencyInput(product?.hpp || 0);
    const marginInput = usePercentInput(product?.margin || 0);

    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl bg-muted/50 p-4">
                <h1 className="text-xl font-black">Create Product</h1>
                <Button asChild variant={'destructive'} className="cursor-pointer dark:text-white">
                    <Link href={index()}>Back</Link>
                </Button>
            </div>
            <div className="mx-6 h-full rounded-xl bg-muted/50 p-4">
                <div className="flex items-center py-4">
                    <Form {...ProductController.store.form()} className="grid w-full grid-cols-2 gap-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Product Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="Enter this product name"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
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
                                <div className="flex flex-wrap space-y-2">
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
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Estimated Selling Price</Label>
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
                                <div className="col-span-2 flex justify-center md:justify-end">
                                    <Button type="submit" tabIndex={5} className="w-full cursor-pointer md:w-1/2" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
