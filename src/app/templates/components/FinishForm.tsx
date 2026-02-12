'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Camera, User, Upload, Trash } from '@/ui/icons';
import { Button } from '@/ui/components/button';
import { useTranslations } from 'next-intl';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import Image from 'next/image';

export const FinishForm = () => {
	const $t = useTranslations('FinishForm');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const profileImage = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData.profileImage);
	const updateResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.updateResumeUserData);

	const storeImageLocally = useCallback(
		async (file: File) => {
			if (!file.type.startsWith('image/')) {
				setError($t('uploadError'));
				return;
			}

			setIsUploading(true);
			setError(null);
			try {
				const imageDataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => {
						if (typeof reader.result === 'string') {
							resolve(reader.result);
							return;
						}
						reject(new Error('Invalid image format'));
					};
					reader.onerror = () => reject(new Error('Failed to read image'));
					reader.readAsDataURL(file);
				});

				updateResumeUserData({ profileImage: imageDataUrl });
			} catch {
				setError($t('uploadError'));
			} finally {
				setIsUploading(false);
			}
		},
		[updateResumeUserData, $t]
	);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				storeImageLocally(file);
			}
		},
		[storeImageLocally]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files?.[0];
			if (file && file.type.startsWith('image/')) {
				storeImageLocally(file);
			}
		},
		[storeImageLocally]
	);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	}, []);

	const handleRemove = useCallback(() => {
		updateResumeUserData({ profileImage: '' });
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [updateResumeUserData]);

	return (
		<div>
			<div className="space-y-4">
				<div>
					<h4 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">{$t('title')}</h4>
					<p className="text-slate-600 dark:text-slate-400">{$t('description')}</p>
				</div>

				<div
					className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-primary/50 transition-colors"
					onDrop={handleDrop}
					onDragOver={handleDragOver}
				>
					{/* Photo preview */}
					<div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
						{profileImage ? (
							<Image src={profileImage} alt="Profile" fill unoptimized className="object-cover" />
						) : (
							<User className="w-16 h-16 text-slate-400 dark:text-slate-500" />
						)}

						{isUploading && (
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
							</div>
						)}

						{profileImage && !isUploading && (
							<button
								onClick={() => fileInputRef.current?.click()}
								className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center group"
							>
								<Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
							</button>
						)}
					</div>

					{/* Actions */}
					<div className="flex flex-col items-center gap-2">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>

						{!profileImage ? (
							<>
								<Button
									type="button"
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
									disabled={isUploading}
									className="flex items-center gap-2"
								>
									<Upload className="w-4 h-4" />
									{isUploading ? $t('uploading') : $t('uploadButton')}
								</Button>
								<p className="text-sm text-slate-400 dark:text-slate-500">{$t('dragHint')}</p>
							</>
						) : (
							<Button
								type="button"
								variant="outline"
								onClick={handleRemove}
								className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
							>
								<Trash className="w-4 h-4" />
								{$t('removeButton')}
							</Button>
						)}
					</div>

					{error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
				</div>
			</div>
		</div>
	);
};
