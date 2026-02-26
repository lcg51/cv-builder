import { Card } from '@/ui/components/card';
import { Skeleton } from '@/ui/components/skeleton';

export const TemplateCardSkeleton = () => {
	return (
		<Card className="overflow-hidden">
			<div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
				<div className="relative w-full aspect-[4/3] md:aspect-[3/4] xl:aspect-[3/4]">
					<Skeleton className="absolute inset-0 w-full h-full rounded-none" />
				</div>
			</div>
		</Card>
	);
};
