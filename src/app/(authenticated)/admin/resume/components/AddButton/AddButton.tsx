'use client';
import { PlusSquare } from 'lucide-react';
import React, { MouseEventHandler } from 'react';

export type AddButtonProps = {
	onClickCallback: MouseEventHandler<HTMLDivElement | undefined>;
};

export const AddButton = ({ onClickCallback }: AddButtonProps) => {
	return (
		<div>
			<div
				className="p-14 py-24 border 
        items-center flex 
        justify-center bg-secondary
        rounded-lg h-[280px]
        hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed"
				onClick={onClickCallback}
			>
				<PlusSquare />
			</div>
		</div>
	);
};
