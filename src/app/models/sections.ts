import { Download, Eye, FileText, Zap } from '@/ui/icons';
import { useTranslations } from 'next-intl';

// Custom hook to get translated sections data
export const useSectionsData = () => {
	const $t = useTranslations('HomePage');

	const features = [
		{
			icon: FileText,
			title: $t('featuresSection.features.0.title'),
			description: $t('featuresSection.features.0.description')
		},
		{
			icon: Eye,
			title: $t('featuresSection.features.1.title'),
			description: $t('featuresSection.features.1.description')
		},
		{
			icon: Download,
			title: $t('featuresSection.features.2.title'),
			description: $t('featuresSection.features.2.description')
		},
		{
			icon: Zap,
			title: $t('featuresSection.features.3.title'),
			description: $t('featuresSection.features.3.description')
		}
	];

	const steps = [
		{
			number: $t('stepsSection.steps.0.number'),
			title: $t('stepsSection.steps.0.title'),
			description: $t('stepsSection.steps.0.description')
		},
		{
			number: $t('stepsSection.steps.1.number'),
			title: $t('stepsSection.steps.1.title'),
			description: $t('stepsSection.steps.1.description')
		},
		{
			number: $t('stepsSection.steps.2.number'),
			title: $t('stepsSection.steps.2.title'),
			description: $t('stepsSection.steps.2.description')
		}
	];

	const stats = [
		{
			label: $t('statsSection.stats.0.label'),
			value: $t('statsSection.stats.0.value')
		},
		{
			label: $t('statsSection.stats.1.label'),
			value: $t('statsSection.stats.1.value')
		},
		{
			label: $t('statsSection.stats.2.label'),
			value: $t('statsSection.stats.2.value')
		}
	];

	const benefits = [
		$t('benefitsSection.benefits.0'),
		$t('benefitsSection.benefits.1'),
		$t('benefitsSection.benefits.2'),
		$t('benefitsSection.benefits.3')
	];

	return { features, steps, stats, benefits };
};
