import { Button } from '@/components/ui';

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
		<div className="max-w-lg p-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
			<div className="p-2 bg-white border from-primary/10 to-secondary/10 dark:bg-slate-700 dark:from-primary/20 dark:to-secondary/20 backdrop-blur-sm rounded-lg">
				<div className="text-center p-8">
					<h1 className="text-2xl font-bold uppercase text-red-400 mb-4">{errorTitle}</h1>
					<p className="text-gray-600 dark:text-gray-400 mb-6">{errorMsg}</p>
					<Button variant="default" onClick={onClickCallback} className="px-6 py-3 text-white">
						{errorIcon && errorIcon}
						{errorButtonText}
					</Button>
				</div>
			</div>
		</div>
	);
};
