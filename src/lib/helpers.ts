export const getFirstTwoCapitalLetters = (name?: string | null): string => {
	if (!name) return 'U';
	const words = name.split(' ');
	if (words.length === 1) {
		return words[0].charAt(0).toUpperCase();
	}
	return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const getFirstTwoCapitalLettersFromGoogleProfileImage = (str?: string | null) => {
	const match = (str || '').match(/[A-Z]/g);
	return match ? match.slice(0, 2).join('') : 'U';
};

export const getGoogleProfileImage = (imageUrl?: string | null): string | undefined => {
	if (!imageUrl) return undefined;

	// If it's already a Google URL, return as is
	if (imageUrl.includes('lh3.googleusercontent.com')) {
		return imageUrl;
	}

	// If it's a relative URL, make it absolute
	if (imageUrl.startsWith('/')) {
		return `${process.env.NEXTAUTH_URL}${imageUrl}`;
	}

	return imageUrl;
};

// Check if dates need to be converted from strings to Date objects
export const needsDateConversion = (data: unknown): boolean => {
	if (Array.isArray(data)) {
		return data.some(needsDateConversion);
	}
	if (data && typeof data === 'object') {
		for (const [key, value] of Object.entries(data)) {
			if ((key === 'startDate' || key === 'endDate' || key === 'finishDate') && typeof value === 'string') {
				return true;
			}
			if (needsDateConversion(value)) {
				return true;
			}
		}
	}
	return false;
};

export const deserializeDates = (data: unknown): unknown => {
	if (Array.isArray(data)) {
		return data.map(deserializeDates);
	}
	if (data && typeof data === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data)) {
			if (key === 'startDate' || key === 'endDate' || key === 'finishDate') {
				result[key] = value ? new Date(value as string) : new Date();
			} else {
				result[key] = deserializeDates(value);
			}
		}
		return result;
	}
	return data;
};
