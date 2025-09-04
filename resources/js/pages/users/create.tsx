import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z
    .object({
        name: z.string().min(2, {
            message: 'Name must be at least 2 characters.',
        }),
        email: z.string().email({
            message: 'Invalid email address.',
        }),
        password: z.string().min(6, {
            message: 'Password must be at least 6 characters.',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Confirm Password must be at least 6 characters.',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
    });

export default function UsersCreate() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });
    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast('You submitted the following values', {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6">
                            <div className="mx-6 flex h-20 items-center justify-between rounded-xl bg-muted/50 p-2">
                                <h1 className="text-xl font-black">Create Users</h1>
                                <Button variant={'destructive'} className="dark:text-white" onClick={() => router.visit('/users')}>
                                    Back
                                </Button>
                            </div>
                            <div className="mx-6 h-full rounded-xl bg-muted/50 p-4">
                                <div className="flex items-center py-4">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full grid-cols-2 gap-4 space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter for name user" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter for email user" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="********" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm Password</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="********" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="col-span-2 flex justify-center md:justify-end">
                                                <Button className="w-full md:w-1/2" type="submit">
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
