import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface Stat {
    title: string;
    value: number;
    delta: number | null;
    lastMonth: number;
    positive: boolean;
    prefix?: string;
    suffix?: string;
    format?: (v: number) => string;
    lastFormat?: (v: number) => string;
}

function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M';
    if (n >= 1_000) return n.toLocaleString();
    return n.toString();
}

export default function CardStatistic({ stats }: { stats: Stat[] }) {
    return (
        <div className="flex items-center justify-center">
            <div className="grid grow grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="border-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2.5">
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl font-medium tracking-tight text-foreground">
                                    {stat.format ? stat.format(stat.value) : `${stat.prefix || ''}${(stat.value)}${stat.suffix || ''}`}
                                </span>
                                {stat.delta !== null && stat.delta !== undefined && (
                                    <Badge variant={stat.positive ? 'success' : 'destructive'} appearance="light">
                                        {stat.delta > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                        {Math.abs(stat.delta)}%
                                    </Badge>
                                )}
                            </div>
                            <div className="mt-2 border-t pt-2.5 text-xs text-muted-foreground">
                                Vs last month:{' '}
                                <span className="font-medium text-foreground">
                                    {stat.lastFormat
                                        ? stat.lastFormat(stat.lastMonth)
                                        : `${stat.prefix || ''}${formatNumber(stat.lastMonth)}${stat.suffix || ''}`}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
