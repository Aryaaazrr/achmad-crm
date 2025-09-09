import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'Product Terlaris Chart';

const chartConfig: ChartConfig = {
    visitors: {
        label: 'Jumlah Terjual',
    },
};

const colors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
];

interface ChartBarMixedProps {
    data: { product: string; total: number }[];
}

export function ChartBarMixed({ data }: ChartBarMixedProps) {
    const chartData = data.map((item, index) => ({
        browser: item.product,
        visitors: item.total,
        fill: colors[index % colors.length],
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Best Selling Product</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0 }}
                    >
                        <YAxis
                            dataKey="browser"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis dataKey="visitors" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar
                            dataKey="visitors"
                            layout="vertical"
                            radius={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
