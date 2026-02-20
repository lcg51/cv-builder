import { Card } from '@/ui/components/card';
import { type TemplateDataType } from '@/app/templates/templates.service';
import { CheckIcon, EyeIcon, StarIcon } from '@/ui/icons';
import Image from 'next/image';

type TemplateProps = {
	template: TemplateDataType;
	selectedTemplateId?: string;
	onClickTemplate?: (id: string) => void;
};

export const Template = ({ template, selectedTemplateId = '', onClickTemplate }: TemplateProps) => {
	return (
		<Card
			key={template.id}
			className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
				selectedTemplateId === template.id ? 'ring-2 ring-primary shadow-xl scale-105' : 'hover:scale-105'
			}`}
			onClick={() => onClickTemplate?.(template.id)}
		>
			{/* Template Preview Image - Fixed Aspect Ratio Container */}
			<div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
				{/* Fixed aspect ratio container (16:9 ratio) */}
				<div className="relative w-full aspect-[4/3] md:aspect-[3/4] xl:aspect-[3/4]">
					{template.previewImage ? (
						<Image
							src={template.previewImage}
							alt={`${template.name} preview`}
							fill
							unoptimized
							className="object-contain transition-transform duration-300 group-hover:scale-110"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					) : (
						<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700">
							<span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
								{template.name}
							</span>
						</div>
					)}
				</div>

				{/* Hover Overlay with Template Info */}
				<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
					<div className="text-center text-white p-4 max-w-xs">
						<div className="flex items-center justify-center mb-3">
							<EyeIcon className="w-6 h-6 mr-2" />
							<span className="text-sm font-medium">Preview</span>
						</div>
						<h4 className="text-lg font-semibold mb-2">{template.name}</h4>
						<p className="text-sm text-gray-200 mb-3 line-clamp-3">{template.description}</p>

						{/* Features */}
						{template.features.length > 0 && (
							<div className="space-y-2">
								<div className="flex items-center justify-center text-xs">
									<StarIcon className="w-3 h-3 mr-1" />
									<span>Key Features:</span>
								</div>
								<div className="flex flex-wrap justify-center gap-1">
									{template.features.slice(0, 2).map((feature, index) => (
										<span
											key={index}
											className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full"
										>
											{feature}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Tags */}
						{template.tags.length > 0 && (
							<div className="mt-3 flex flex-wrap justify-center gap-1">
								{template.tags.slice(0, 3).map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 text-xs bg-primary/80 text-white rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Selection Indicator */}
				{selectedTemplateId === template.id && (
					<div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
						<CheckIcon className="w-5 h-5 text-muted" />
					</div>
				)}

				{/* Category Badge */}
				{template.category && (
					<div className="absolute top-4 left-4">
						<span className="px-3 py-1 text-xs font-medium bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 rounded-full capitalize shadow-sm">
							{template.category}
						</span>
					</div>
				)}
			</div>

			{/* Template Info */}

			{/* Selection Overlay */}
			{selectedTemplateId === template.id && (
				<div className="absolute inset-0 bg-primary/5 border-2 border-muted rounded-lg pointer-events-none" />
			)}
		</Card>
	);
};
