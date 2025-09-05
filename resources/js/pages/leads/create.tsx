import LeadsController, { index } from '@/actions/App/Http/Controllers/LeadsController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import usePhoneInput from '@/hooks/use-phone';
import AppLayout from '@/layouts/app-layout';
import { Form, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface Leads {
    id_leads: number;
    name: string;
    contact: string;
    address: string;
    need: string;
    status: 'new' | 'contacted' | 'negotiation' | 'deal' | 'cancel';
    id_user: number
}

interface Props {
    leads: Leads;
}

export default function LeadsCreate({leads}: Props) {
    const contactInput = usePhoneInput(leads?.contact || '');

    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl bg-muted/50 p-4">
                <h1 className="text-xl font-black">Create Leads</h1>
                <Button asChild variant={'destructive'} className="cursor-pointer dark:text-white">
                    <Link href={index()}>Back</Link>
                </Button>
            </div>
            <div className="mx-6 h-full rounded-xl bg-muted/50 p-4">
                <div className="flex items-center py-4">
                    <Form {...LeadsController.store.form()} className="grid w-full grid-cols-2 gap-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="Enter this name"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
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
                                    <input type="hidden" name="contact" value={contactInput.rawValue}  />
                                    <InputError message={errors.contact} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        name="address"
                                        required
                                        tabIndex={3}
                                        placeholder="Enter this address"
                                    />
                                    <input type="hidden" />
                                    <InputError message={errors.address} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Needs</Label>
                                    <Input
                                        id="needs"
                                        type="text"
                                        name="needs"
                                        required
                                        tabIndex={3}
                                        placeholder="Enter this needs"
                                    />
                                    <input type="hidden"  />
                                    <InputError message={errors.needs} />
                                </div>
                                <div className="flex flex-col space-y-2 col-span-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" required>
                                        <SelectTrigger tabIndex={5} className='w-full'>
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
