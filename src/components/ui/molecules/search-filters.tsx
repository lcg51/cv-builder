'use client';
import { Button } from '../button';
import { FilterIcon, SearchIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

type FiltersProps<T> = {
	searchQuery: string;
	tags: T[];
	onSearch: (query: string) => void;
	onSelectCategory: (category: T | 'all') => void;
};

export const SearchFilters = <T extends string>({ searchQuery, onSearch, onSelectCategory, tags }: FiltersProps<T>) => {
	const [selectedCategory, setSelectedCategory] = useState<T | 'all'>('all');

	const handleSelectCategory = useCallback(
		(category: T | 'all') => {
			setSelectedCategory(category);
			onSelectCategory(category);
		},
		[onSelectCategory]
	);

	return (
		<div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 sticky top-[3.5rem] z-20 space-y-4 p-4 lg:p-6">
			{/* Search Bar */}
			<div className="relative max-w-md mx-auto">
				<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
				<input
					type="text"
					placeholder="Search templates..."
					value={searchQuery}
					onChange={e => onSearch(e.target.value)}
					className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
			</div>

			{/* Category Filter */}
			<div className="flex flex-wrap justify-center gap-2 mx-auto">
				<Button
					variant={selectedCategory === 'all' ? 'default' : 'outline'}
					size="sm"
					onClick={() => handleSelectCategory('all')}
					className="flex items-center gap-2"
				>
					<FilterIcon className="w-4 h-4" />
					All
				</Button>
				{tags.map(tag => (
					<Button
						key={tag}
						variant={selectedCategory === tag ? 'default' : 'outline'}
						size="sm"
						onClick={() => handleSelectCategory(tag)}
						className="capitalize"
					>
						{tag}
					</Button>
				))}
			</div>
		</div>
	);
};
