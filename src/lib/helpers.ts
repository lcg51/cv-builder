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
