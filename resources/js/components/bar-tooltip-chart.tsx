import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis } from 'recharts';

interface Lead {
    id: number;
    status: string;
    created_at: string;
    [key: string]: unknown;
}

interface ChartTooltipLabelCustomProps {
    data?: Lead[];
}

export function ChartTooltipLabelCustom({ data = [] }: ChartTooltipLabelCustomProps) {
    // Group leads by status
    const grouped = data.reduce<Record<string, number>>((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, {});

    // Convert grouped data into chartData
    const chartData = Object.entries(grouped).map(([status, count]) => ({
        status,
        count,
    }));

    const chartConfig: ChartConfig = {
        activities: { label: 'Leads Status' },
        ...Object.fromEntries(Object.keys(grouped).map((status, i) => [status, { label: status, color: `var(--chart-${i + 1})` }])),
    };

    if (!data.length) {
        return <p className="p-4 text-sm text-muted-foreground">No data available</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leads Status Chart</CardTitle>
                <CardDescription>Shows the number of leads per status.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="status" tickLine={false} axisLine={false} />
                        <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                        <ChartTooltip content={<ChartTooltipContent labelKey="activities" indicator="line" />} cursor={false} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
