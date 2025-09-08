import UserController, { index } from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, SquarePen } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface Props {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: users.index().url,
    },
    {
        title: 'Edit',
        href: users.index().url,
    },
];

export default function UsersEdit({ user }: Props) {
    const { props } = usePage<{ roles: { id: number; name: string }[] }>();
    const roles = props.roles;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Users" />
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-lg font-black sm:text-xl">{user.name}</h1>
                    <small className="hidden text-muted-foreground sm:flex">Update the details of this users to keep the information accurate</small>
                </div>
            </div>
            <div className="mx-6 h-full rounded-xl">
                <div className="flex items-center py-4">
                    <Form {...UserController.update.form(user.id)} className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                        {({ processing, errors }) => (
                            <>
                                {/* Name (readOnly) */}
                                <div className="flex flex-col space-y-2">
                                    <Label>Name</Label>
                                    <Input id="name" type="text" value={user.name} readOnly />
                                </div>

                                {/* Email (readOnly) */}
                                <div className="flex flex-col space-y-2">
                                    <Label>Email</Label>
                                    <Input id="email" type="email" value={user.email} readOnly />
                                </div>

                                {/* Role (editable) */}
                                <div className="col-span-1 flex flex-col space-y-2 md:col-span-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" required defaultValue={user.roles[0].name}>
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

                                {/* Submit */}
                                <div className="col-span-1 flex justify-end gap-2 md:col-span-2">
                                    <Button asChild variant={'secondary'} className="cursor-pointer ">
                                        <Link href={index()}> <ArrowLeft /> Back</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        tabIndex={5}
                                        className="cursor-pointer text-white bg-amber-500 hover:bg-amber-600"
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        <SquarePen />
                                        Update
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
