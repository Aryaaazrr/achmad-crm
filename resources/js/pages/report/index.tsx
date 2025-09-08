import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { DollarSign, Download, Filter, RefreshCw, Target, TrendingUp, UserCheck, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const mockData = {
    leads: [
        { id: 1, name: 'John Doe', status: 'new', created_at: '2024-01-15', contact: '081234567890', needs: 'Software Development' },
        { id: 2, name: 'Jane Smith', status: 'deal', created_at: '2024-01-20', contact: '081234567891', needs: 'Web Design' },
        { id: 3, name: 'Bob Johnson', status: 'negotiation', created_at: '2024-02-05', contact: '081234567892', needs: 'Mobile App' },
        { id: 4, name: 'Alice Brown', status: 'contacted', created_at: '2024-02-10', contact: '081234567893', needs: 'Consulting' },
        { id: 5, name: 'Charlie Wilson', status: 'cancel', created_at: '2024-02-15', contact: '081234567894', needs: 'E-commerce' },
    ],
    customers: [
        { id: 1, name: 'John Doe', status: 'active', created_at: '2024-01-25' },
        { id: 2, name: 'Jane Smith', status: 'active', created_at: '2024-01-28' },
        { id: 3, name: 'Tech Corp', status: 'non-active', created_at: '2024-02-01' },
    ],
    projects: [
        { id: 1, customer: 'John Doe', total_price: 15000000, status: 'approved', created_at: '2024-01-26' },
        { id: 2, customer: 'Jane Smith', total_price: 25000000, status: 'pending', created_at: '2024-02-01' },
        { id: 3, customer: 'Tech Corp', total_price: 50000000, status: 'rejected', created_at: '2024-02-05' },
    ],
};

export default function ReportingDashboard() {
    const [dateRange, setDateRange] = useState({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
    });
    const [reportType, setReportType] = useState('overview');
    const [isExporting, setIsExporting] = useState(false);

    const filteredData = useMemo(() => {
        const filterByDate = (items, dateField) => {
            return items.filter((item) => {
                const itemDate = new Date(item[dateField]);
                const start = new Date(dateRange.startDate);
                const end = new Date(dateRange.endDate);
                return itemDate >= start && itemDate <= end;
            });
        };

        return {
            leads: filterByDate(mockData.leads, 'created_at'),
            customers: filterByDate(mockData.customers, 'created_at'),
            projects: filterByDate(mockData.projects, 'created_at'),
        };
    }, [dateRange]);

    const stats = useMemo(() => {
        const leads = filteredData.leads;
        const customers = filteredData.customers;
        const projects = filteredData.projects;

        return {
            totalLeads: leads.length,
            leadsConversion: leads.filter((l) => l.status === 'deal').length,
            conversionRate: leads.length ? ((leads.filter((l) => l.status === 'deal').length / leads.length) * 100).toFixed(1) : '0',
            totalCustomers: customers.length,
            activeCustomers: customers.filter((c) => c.status === 'active').length,
            totalProjects: projects.length,
            approvedProjects: projects.filter((p) => p.status === 'approved').length,
            totalRevenue: projects.filter((p) => p.status === 'approved').reduce((sum, p) => sum + p.total_price, 0),
            pendingRevenue: projects.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.total_price, 0),
        };
    }, [filteredData]);

    const leadStatusData = useMemo(() => {
        const statusCount = filteredData.leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCount).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
        }));
    }, [filteredData.leads]);

    const monthlyData = useMemo(() => {
        const months = {};

        filteredData.leads.forEach((lead) => {
            const month = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!months[month]) months[month] = { month, leads: 0, customers: 0, projects: 0, revenue: 0 };
            months[month].leads++;
        });

        filteredData.customers.forEach((customer) => {
            const month = new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!months[month]) months[month] = { month, leads: 0, customers: 0, projects: 0, revenue: 0 };
            months[month].customers++;
        });

        filteredData.projects.forEach((project) => {
            const month = new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!months[month]) months[month] = { month, leads: 0, customers: 0, projects: 0, revenue: 0 };
            months[month].projects++;
            if (project.status === 'approved') {
                months[month].revenue += project.total_price / 1000000; // Convert to millions
            }
        });

        return Object.values(months).sort((a, b) => new Date(a.month) - new Date(b.month));
    }, [filteredData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleExport = async () => {
        setIsExporting(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const csvData = [];

        if (reportType === 'overview' || reportType === 'leads') {
            csvData.push('=== LEADS REPORT ===');
            csvData.push('Name,Status,Contact,Needs,Created Date');
            filteredData.leads.forEach((lead) => {
                csvData.push(`${lead.name},${lead.status},${lead.contact},${lead.needs},${lead.created_at}`);
            });
            csvData.push('');
        }

        if (reportType === 'overview' || reportType === 'customers') {
            csvData.push('=== CUSTOMERS REPORT ===');
            csvData.push('Name,Status,Created Date');
            filteredData.customers.forEach((customer) => {
                csvData.push(`${customer.name},${customer.status},${customer.created_at}`);
            });
            csvData.push('');
        }

        if (reportType === 'overview' || reportType === 'projects') {
            csvData.push('=== PROJECTS REPORT ===');
            csvData.push('Customer,Total Price,Status,Created Date');
            filteredData.projects.forEach((project) => {
                csvData.push(`${project.customer},${project.total_price},${project.status},${project.created_at}`);
            });
        }

        const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportType}-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setIsExporting(false);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <AppLayout>
            <div className="mx-6 flex h-20 items-center justify-between rounded-xl">
                <div>
                    <h1 className="text-xl font-black">Report Data</h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExport} disabled={isExporting} className="bg-green-600 hover:bg-green-700">
                        {isExporting ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Export to Excel
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="mx-6 h-full rounded-xl gap-4 space-y-4">
                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <Label htmlFor="reportType">Report Type</Label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="overview">Overview Report</SelectItem>
                                        <SelectItem value="leads">Leads Report</SelectItem>
                                        <SelectItem value="customers">Customers Report</SelectItem>
                                        <SelectItem value="projects">Projects Report</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" className="w-full">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Refresh Data
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-600">
                                Total Leads
                                <Users className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalLeads}</div>
                            <div className="flex items-center text-sm text-green-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {stats.conversionRate}% conversion rate
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-600">
                                Active Customers
                                <UserCheck className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
                            <div className="text-sm text-gray-500">of {stats.totalCustomers} total customers</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-600">
                                Revenue (Approved)
                                <DollarSign className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                            <div className="text-sm text-blue-600">{formatCurrency(stats.pendingRevenue)} pending</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-600">
                                Projects
                                <Target className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProjects}</div>
                            <div className="text-sm text-green-600">{stats.approvedProjects} approved</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lead Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={leadStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {leadStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="leads" stroke="#8884d8" name="Leads" />
                                    <Line type="monotone" dataKey="customers" stroke="#82ca9d" name="Customers" />
                                    <Line type="monotone" dataKey="projects" stroke="#ffc658" name="Projects" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Tables */}
                <Tabs value={reportType} onValueChange={setReportType}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="leads">Leads</TabsTrigger>
                        <TabsTrigger value="customers">Customers</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Summary Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600">{stats.totalLeads}</div>
                                            <div className="text-sm text-gray-600">Total Leads</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">{stats.leadsConversion}</div>
                                            <div className="text-sm text-gray-600">Converted Leads</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-600">{stats.activeCustomers}</div>
                                            <div className="text-sm text-gray-600">Active Customers</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-orange-600">{stats.approvedProjects}</div>
                                            <div className="text-sm text-gray-600">Approved Projects</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="leads">
                        <Card>
                            <CardHeader>
                                <CardTitle>Leads Report</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-96">
                                    <div className="space-y-2">
                                        {filteredData.leads.map((lead) => (
                                            <div key={lead.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <div className="font-medium">{lead.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {lead.contact} • {lead.needs}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={lead.status === 'deal' ? 'default' : 'secondary'}>{lead.status}</Badge>
                                                    <div className="mt-1 text-sm text-gray-500">{lead.created_at}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="customers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customers Report</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-96">
                                    <div className="space-y-2">
                                        {filteredData.customers.map((customer) => (
                                            <div key={customer.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <div className="font-medium">{customer.name}</div>
                                                    <div className="text-sm text-gray-600">Customer ID: #{customer.id}</div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                                                        {customer.status}
                                                    </Badge>
                                                    <div className="mt-1 text-sm text-gray-500">{customer.created_at}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="projects">
                        <Card>
                            <CardHeader>
                                <CardTitle>Projects Report</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-96">
                                    <div className="space-y-2">
                                        {filteredData.projects.map((project) => (
                                            <div key={project.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div>
                                                    <div className="font-medium">{project.customer}</div>
                                                    <div className="text-sm text-gray-600">Project #{project.id}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-green-600">{formatCurrency(project.total_price)}</div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={
                                                                project.status === 'approved'
                                                                    ? 'default'
                                                                    : project.status === 'pending'
                                                                      ? 'secondary'
                                                                      : 'destructive'
                                                            }
                                                        >
                                                            {project.status}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">{project.created_at}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
