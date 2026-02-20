export type User = {
	id: string;
	name: string | null;
	email: string;
	emailVerified?: Date | null;
	image?: string | null;
};
