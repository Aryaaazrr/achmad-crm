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
            {/* Header */}
            <div className="mx-6 mb-6 flex h-20 items-center justify-between rounded-xl">
                <h1 className="text-xl font-black">Create Users</h1>
                <Button asChild variant="destructive" className="cursor-pointer bg-red-900 text-white hover:bg-red-800">
                    <Link href={index()}>Back</Link>
                </Button>
            </div>

            {/* Form */}
            <div className="mx-6 rounded-xl">
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
                                <Input id="password" name="password" type="password" placeholder="********" autoComplete="new-password" required />
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

                            {/* Submit Button */}
                            <div className="col-span-1 flex justify-end md:col-span-2">
                                <Button type="submit" className="w-full cursor-pointer md:w-1/3" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
