import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalDisclaimerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	cancelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function ModalDisclaimer({
	open,
	onOpenChange,
	title = '⚠️ Unsaved Changes',
	description = 'You have unsaved changes. If you leave this page, all your progress will be lost.',
	confirmText = 'Leave and Lose Progress',
	cancelText = 'Stay and Continue',
	onConfirm,
	onCancel,
	confirmVariant = 'destructive',
	cancelVariant = 'outline'
}: ModalDisclaimerProps) {
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			onCancel();
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
				<DialogHeader>
					<DialogTitle className="text-red-600 dark:text-red-400 text-xl font-bold">{title}</DialogTitle>
					<DialogDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
						{description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
					<Button
						variant={cancelVariant}
						onClick={onCancel}
						className="w-full sm:w-auto border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
					>
						{cancelText}
					</Button>
					<Button
						variant={confirmVariant}
						onClick={onConfirm}
						className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition-colors"
					>
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
