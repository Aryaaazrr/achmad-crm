import UserController, { index } from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Form, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user: User;
}

export default function UsersEdit({ user }: Props) {
    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl bg-muted/50 p-4">
                <h1 className="text-xl font-black">Edit User - {user.name}</h1>
                <Button asChild variant={'destructive'} className="cursor-pointer dark:text-white">
                    <Link href={index()}>Back</Link>
                </Button>
            </div>
            <div className="mx-6 h-full rounded-xl bg-muted/50 p-4">
                <div className="flex items-center py-4">
                    <Form
                        {...UserController.update.form(user.id)}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="grid w-full grid-cols-2 gap-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        defaultValue={user.name}
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder="Enter this name user account"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        defaultValue={user.email}
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="col-span-2 flex justify-center md:justify-end">
                                    <Button
                                        type="submit"
                                        className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 md:w-1/2"
                                        disabled={processing}
                                        tabIndex={4}
                                    >
                                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                        {processing ? 'Updating...' : 'Update User'}
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
