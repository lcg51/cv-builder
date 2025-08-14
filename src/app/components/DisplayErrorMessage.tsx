import { Button } from '@/components/ui';
import { Card } from '@/components/ui/card';

type DisplayErrorMessageProps = {
	errorMsg: string;
	onClickCallback: () => void;
	errorTitle: string;
	errorButtonText: string;
	errorIcon?: React.ReactNode;
};

export const DisplayErrorMessage = ({
	errorMsg,
	onClickCallback,
	errorTitle,
	errorButtonText,
	errorIcon
}: DisplayErrorMessageProps) => {
	return (
		<Card className="max-w-md mx-auto flex p-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10 dark:bg-slate-700 dark:from-primary/20 dark:to-secondary/20 backdrop-blur-sm">
			<div className="flex items-center justify-center">
				<div className="text-center p-8">
					<h1 className="text-2xl font-bold text-red-400 mb-4">{errorTitle}</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">{errorMsg}</p>
					<Button variant="default" onClick={onClickCallback} className="px-6 py-3 text-white">
						{errorIcon && errorIcon}
						{errorButtonText}
					</Button>
				</div>
			</div>
		</Card>
	);
};
