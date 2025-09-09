import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardToolbar } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { index } from '@/routes/report';
import { Link } from '@inertiajs/react';
import { CheckCircle, MoreHorizontal, Pin, Settings, Share2, Trash, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';

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

interface CardActivityProps {
    title: string;
    subtitle: string;
    performance: Performance[];
    pipelineProgress: number;
    activity: Activity[];
}

export default function CardActivity({ title, subtitle, performance, pipelineProgress, activity }: CardActivityProps) {
    return (
        <div className="flex items-center justify-center">
            <Card className="w-full">
                <CardHeader className="h-auto py-4">
                    <CardTitle className="flex flex-col gap-1">
                        <span>{title}</span>
                        <span className="text-xs font-normal text-muted-foreground">{subtitle}</span>
                    </CardTitle>
                    <CardToolbar>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="dim" size="sm" mode="icon" className="-me-1.5">
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="bottom">
                                <DropdownMenuItem>
                                    <Settings />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <TriangleAlert /> Add Alert
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Pin /> Pin to Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Share2 /> Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                    <Trash />
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardToolbar>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Performance */}
                    <div>
                        <div className="mb-2.5 text-sm font-medium text-accent-foreground"> Performance</div>
                        <div className="grid grid-cols-3 gap-2">
                            {performance.map((item) => (
                                <div className="flex flex-col items-start justify-start" key={item.label}>
                                    <div className="text-xl font-bold text-foreground">{item.value}</div>
                                    <div className="mb-1 text-xs font-medium text-muted-foreground">{item.label}</div>
                                    <span
                                        className={cn(
                                            'flex items-center gap-0.5 text-xs font-semibold',
                                            item.trendDir === 'up' ? 'text-green-500' : 'text-destructive',
                                        )}
                                    >
                                        {item.trendDir === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {item.trendDir === 'up' ? '+' : '-'}
                                        {item.trend}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Pipeline Progress */}
                    <div>
                        <div className="mb-2.5 flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Pipeline Progress</span>
                            <span className="text-xs font-semibold text-foreground">{pipelineProgress}%</span>
                        </div>
                        <Progress value={pipelineProgress} className="bg-muted" />
                    </div>

                    <Separator />

                    {/* Recent Activity */}
                    <div>
                        <div className="mb-2.5 text-sm font-medium text-foreground">Recent Activity</div>
                        <ul className="space-y-2">
                            {activity.map((a, i) => (
                                <li key={i} className="flex items-center justify-between gap-2.5 text-sm">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className={cn('h-3.5 w-3.5', a.color)} />
                                        <span className="truncate text-xs text-foreground">{a.text}</span>
                                    </span>
                                    <Badge variant={a.state === 'secondary' ? 'secondary' : 'destructive'} appearance="light" size="sm">
                                        {a.date}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="flex h-auto gap-2.5 py-3.5">
                    <Button asChild variant="primary" className="flex-1 text-white">
                        <Link href={index()} >
                            Go to Report
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
