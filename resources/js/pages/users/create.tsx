import UserController, { index } from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import {type BreadcrumbItem } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Send } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
    {
        title: 'Create',
        href: users.index().toString(),
    },
];


export default function UsersCreate() {
    const { props } = usePage<{ roles: { id: number; name: string }[] }>();
    const roles = props.roles;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Create Users'></Head>
            {/* Header */}
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">Create User</h1>
                    <small className="hidden text-muted-foreground sm:flex">Easily add your user by completing the form below.</small>
                </div>
            </div>

            {/* Form */}
            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Form {...UserController.store.form()} resetOnSuccess={['password']} className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                        {({ processing, errors }) => (
                            <>
                                {/* Name */}
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" type="text" placeholder="Enter user name" autoComplete="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="email@example.com" autoComplete="email" required />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password */}
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="********"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        placeholder="********"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                {/* Role */}
                                <div className="col-span-1 flex flex-col space-y-2 md:col-span-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" required>
                                        <SelectTrigger className="w-full">
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
