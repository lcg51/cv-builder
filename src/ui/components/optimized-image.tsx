'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
	webpSrc: string | StaticImport;
	jpgSrc: string | StaticImport;
	alt: string;
	width?: number;
	height?: number;
	fill?: boolean;
	className?: string;
	priority?: boolean;
	sizes?: string;
	quality?: number;
}

export function OptimizedImage({
	webpSrc,
	jpgSrc,
	alt,
	width,
	height,
	fill = false,
	className,
	priority = false,
	sizes,
	quality = 85
}: OptimizedImageProps) {
	const [webpSupported, setWebpSupported] = useState(true);

	const handleWebpError = () => {
		setWebpSupported(false);
	};

	if (fill) {
		return (
			<Image
				src={webpSupported ? webpSrc : jpgSrc}
				alt={alt}
				fill
				className={className}
				priority={priority}
				sizes={sizes}
				quality={quality}
				onError={handleWebpError}
				placeholder="blur"
				blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
			/>
		);
	}

	return (
		<Image
			src={webpSupported ? webpSrc : jpgSrc}
			alt={alt}
			width={width}
			height={height}
			className={className}
			priority={priority}
			sizes={sizes}
			quality={quality}
			onError={handleWebpError}
			placeholder="blur"
			blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
		/>
	);
}
