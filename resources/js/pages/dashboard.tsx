import CardActivity from '@/components/card-activity';
import CardStatistic from '@/components/card-statistic';
import LineChart from '@/components/line-chart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Performance {
    label: string;
    value: string | number;
    trend: number;
    trendDir: 'up' | 'down';
}

interface Activity {
    text: string;
    date: string;
    state: 'secondary' | 'destructive';
    color: string;
}

interface CardActivityData {
    title: string;
    subtitle: string;
    performance: Performance[];
    pipelineProgress: number;
    activity: Activity[];
}

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

interface ChartData {
    date: string;
    leadsCancel: number;
    leadsDeal: number;
}

interface PageProps {
    stats: Stat[];
    chartData: ChartData[];
    cardActivity: CardActivityData;
    [key: string]: unknown;
}

export default function Dashboard() {
    const { stats = [], chartData = [], cardActivity  } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {stats.length > 0 ? (
                    <CardStatistic stats={stats} />
                ) : (
                    <div className="flex items-center justify-center p-8">
                        <p className="text-muted-foreground">No statistics available</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <LineChart data={chartData} />
                    </div>
                    <CardActivity
                        title={cardActivity.title}
                        subtitle={cardActivity.subtitle}
                        performance={cardActivity.performance}
                        pipelineProgress={cardActivity.pipelineProgress}
                        activity={cardActivity.activity}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
