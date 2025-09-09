import { ChartBarMixed } from '@/components/bar-chart';
import { ChartTooltipLabelCustom } from '@/components/bar-tooltip-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/report';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: index().url,
    },
];

type Filters = {
    startDate?: string;
    endDate?: string;
};

type Lead = {
    id: number;
    name: string;
    status: string;
    contact?: string;
    needs?: string;
    created_at: string;
};

type Customer = {
    name: string;
    status: string;
    created_at: string;
};

type ProjectDetail = {
    product?: {
        name?: string;
    };
    quantity?: number;
};

type Project = {
    customer: string;
    total_price: number;
    status: string;
    created_at: string;
    detail_project?: ProjectDetail[];
};

type PageProps = {
    leads?: Lead[];
    customers?: Customer[];
    projects?: Project[];
    filters?: Filters;
};

export default function Report() {
    const { props } = usePage<PageProps>();

    const leads = useMemo(() => {
        return (props.leads || []).map((lead, idx) => ({
            ...lead,
            id: lead.id ?? idx + 1,
        }));
    }, [props.leads]);
    const customers = useMemo(() => props.customers || [], [props.customers]);
    const projects = useMemo(() => props.projects || [], [props.projects]);

    const [dateRange, setDateRange] = useState({
        startDate: props.filters?.startDate || new Date().toISOString().slice(0, 10),
        endDate: props.filters?.endDate || new Date().toISOString().slice(0, 10),
    });
    const [isExporting, setIsExporting] = useState(false);

    const filteredData = useMemo(() => {
        function filterByDate<T extends { created_at: string }>(items: T[]): T[] {
            const start = new Date(dateRange.startDate);
            const end = new Date(dateRange.endDate);
            return items.filter((item) => {
                const date = new Date(item.created_at);
                return date >= start && date <= end;
            });
        }

        return {
            leads: filterByDate(leads),
            customers: filterByDate(customers),
            projects: filterByDate(projects),
        };
    }, [leads, customers, projects, dateRange]);

    const topProducts = useMemo(() => {
        const counter: Record<string, number> = {};

        filteredData.projects.forEach((project) => {
            project.detail_project?.forEach((detail: ProjectDetail) => {
                const name = detail.product?.name || 'Unknown';
                counter[name] = (counter[name] || 0) + (detail.quantity || 0);
            });
        });

        return Object.entries(counter)
            .map(([product, total]) => ({ product, total }))
            .sort((a, b) => b.total - a.total);
    }, [filteredData.projects]);

    const formatDate = (dateStr: string | Date) => {
        const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        return `${dd}${mm}${yy}`;
    };

    const handleExport = () => {
        setIsExporting(true);
        const csv: string[] = [];

        // --- LEADS ---
        csv.push('"Name","Status","Contact","Needs","Created At"');

        const sortedLeads = [...filteredData.leads].sort((a, b) => {
            if (a.status === 'new' && b.status !== 'new') return -1;
            if (a.status !== 'new' && b.status === 'new') return 1;
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

        sortedLeads.forEach((l) => {
            const name = (l.name ?? '').toString().replace(/"/g, '""');
            const status = (l.status ?? '').replace(/"/g, '""');
            const contact = (l.contact ?? '').replace(/"/g, '""');
            const needs = (l.needs ?? '').replace(/"/g, '""');
            csv.push(`"${name}","${status}","${contact}","${needs}","${formatDate(l.created_at)}"`);
        });

        // Tambahkan baris kosong sebagai pemisah
        csv.push('');

        // --- PRODUCT TERLARIS ---
        csv.push('"Product Name","Total Sold","Start Date"');

        const productMap: Record<string, { totalSold: number; startDate: string }> = {};
        filteredData.projects.forEach((p) => {
            p.detail_project?.forEach((detail) => {
                const productName = detail.product?.name ?? 'Unknown Product';
                const startDate = p.created_at;
                if (!productMap[productName]) {
                    productMap[productName] = { totalSold: detail.quantity ?? 0, startDate };
                } else {
                    productMap[productName].totalSold += detail.quantity ?? 0;
                    if (new Date(startDate) < new Date(productMap[productName].startDate)) {
                        productMap[productName].startDate = startDate;
                    }
                }
            });
        });

        const sortedProducts = Object.entries(productMap).sort(([, a], [, b]) => b.totalSold - a.totalSold);

        sortedProducts.forEach(([name, data]) => {
            csv.push(`"${name.replace(/"/g, '""')}","${data.totalSold}","${formatDate(data.startDate)}"`);
        });

        // --- Download CSV ---
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${formatDate(dateRange.startDate)}-to-${formatDate(dateRange.endDate)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setIsExporting(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-xl font-black">Report Data</h1>
                    <small className="hidden text-muted-foreground md:flex">List of all registered report in the system</small>
                </div>
                <Button onClick={handleExport} disabled={isExporting} className="bg-green-600 text-white hover:bg-green-700">
                    {isExporting ? (
                        <>
                            <RefreshCw className="mr-2 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2" />
                            Export CSV
                        </>
                    )}
                </Button>
            </div>

            <div className="mx-6 h-full rounded-xl">
                {/* Filter */}
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" /> Filter Periode
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                                    <RefreshCw className="mr-2" /> Refresh
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartTooltipLabelCustom data={filteredData.leads} />
                    <ChartBarMixed data={topProducts} />
                </div>
            </div>
        </AppLayout>
    );
}
