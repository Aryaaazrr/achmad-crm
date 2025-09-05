import UserController, { index } from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Form, Link, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function UsersCreate() {
    const { props } = usePage<{ roles: { id: number; name: string }[] }>();
    const roles = props.roles;

    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl bg-muted/50 p-4">
                <h1 className="text-xl font-black">Create Users</h1>
                <Button asChild variant={'destructive'} className="cursor-pointer dark:text-white">
                    <Link href={index()}>Back</Link>
                </Button>
            </div>
            <div className="mx-6 h-full rounded-xl bg-muted/50 p-4">
                <div className="flex items-center py-4">
                    <Form {...UserController.store.form()} resetOnSuccess={['password']} className="grid w-full grid-cols-2 gap-4">
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
                                        required
                                        autoFocus
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        autoFocus
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        placeholder="********"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                                <div className="flex flex-wrap space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        autoFocus
                                        tabIndex={4}
                                        autoComplete="shipping new-password"
                                        placeholder="********"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" required>
                                        <SelectTrigger tabIndex={5} className='w-full'>
                                            <SelectValue placeholder="-- Select Role --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
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
