import { withSkeleton } from '@/ui/components';
import { TemplateCard } from './TemplateCard';
import { TemplateCardSkeleton } from './TemplateCardSkeleton';

export const TemplateWithSkeleton = withSkeleton(TemplateCard, TemplateCardSkeleton);
