import LeadsController, { index } from '@/actions/App/Http/Controllers/LeadsController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import usePhoneInput from '@/hooks/use-phone';
import AppLayout from '@/layouts/app-layout';
import leads from '@/routes/leads';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Send } from 'lucide-react';

interface Leads {
    id_leads: number;
    name: string;
    contact: string;
    address: string;
    need: string;
    status: 'new' | 'contacted' | 'negotiation' | 'deal' | 'cancel';
    id_user: number;
}

interface Props {
    leads: Leads;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Leads',
        href: leads.index().url,
    },
    {
        title: 'Create',
        href: leads.index().toString(),
    },
];

export default function LeadsCreate({ leads }: Props) {
    const contactInput = usePhoneInput(leads?.contact || '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Leads"></Head>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">Create Leads</h1>
                    <small className="hidden text-muted-foreground sm:flex">Easily add your leads by completing the form below.</small>
                </div>
            </div>
            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Form {...LeadsController.store.form()} className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-col space-y-2">
                                    <Label>Name</Label>
                                    <Input id="name" type="text" name="name" required autoFocus tabIndex={1} placeholder="Enter this name" />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>Contact</Label>
                                    <Input
                                        id="contact"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        value={contactInput.displayValue}
                                        onChange={contactInput.handleChange}
                                        placeholder="Enter this contact"
                                    />
                                    <input type="hidden" name="contact" value={contactInput.rawValue} />
                                    <InputError message={errors.contact} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>Address</Label>
                                    <Input id="address" type="text" name="address" required tabIndex={3} placeholder="Enter this address" />
                                    <input type="hidden" />
                                    <InputError message={errors.address} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label>Needs</Label>
                                    <Input id="needs" type="text" name="needs" required tabIndex={3} placeholder="Enter this needs" />
                                    <input type="hidden" />
                                    <InputError message={errors.needs} />
                                </div>
                                <div className="col-span-1 flex flex-col space-y-2 md:col-span-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" required>
                                        <SelectTrigger tabIndex={5} className="w-full">
                                            <SelectValue placeholder="-- Select Status --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="new" value="new">
                                                New
                                            </SelectItem>
                                            <SelectItem key="contacted" value="contacted">
                                                Contacted
                                            </SelectItem>
                                            <SelectItem key="negotiation" value="negotiation">
                                                Negotiation
                                            </SelectItem>
                                            <SelectItem key="deal" value="deal">
                                                Deal
                                            </SelectItem>
                                            <SelectItem key="cancel" value="cancel">
                                                Cancel
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="col-span-1 flex justify-end gap-2 md:col-span-2">
                                    <Button asChild variant={'secondary'} className="cursor-pointer">
                                        <Link href={index()}>
                                            {' '}
                                            <ArrowLeft />
                                            Back
                                        </Link>
                                    </Button>
                                    <Button type="submit" tabIndex={5} className="cursor-pointer text-white" disabled={processing}>
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send />}
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
