import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export type StatAccent = 'primary' | 'success' | 'warning' | 'info' | 'destructive' | 'chart-2';

const accentStyles: Record<StatAccent, { icon: string; bg: string }> = {
  primary: { icon: 'text-primary', bg: 'bg-primary/10' },
  success: { icon: 'text-success', bg: 'bg-success/10' },
  warning: { icon: 'text-warning-foreground', bg: 'bg-warning/20' },
  info: { icon: 'text-info', bg: 'bg-info/10' },
  destructive: { icon: 'text-destructive', bg: 'bg-destructive/10' },
  'chart-2': { icon: 'text-chart-2', bg: 'bg-chart-2/10' },
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: StatAccent;
  href?: string;
  linkLabel?: string;
  isLoading?: boolean;
  className?: string;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  accent = 'primary',
  href,
  linkLabel = 'Ver detalles',
  isLoading,
  className,
}: StatCardProps) {
  const styles = accentStyles[accent];

  return (
    <Card
      className={cn(
        'admin-card border-0 shadow-[var(--shadow-card)] ring-1 ring-border/50',
        className,
      )}
    >
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl',
              styles.bg,
            )}
            aria-hidden
          >
            <Icon className={cn('size-5', styles.icon)} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24" aria-label="Cargando indicador" />
          ) : (
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          )}
        </div>
        {href ? (
          <Link
            href={href}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:underline"
          >
            {linkLabel} →
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
