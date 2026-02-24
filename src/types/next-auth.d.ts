import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
	interface User {
		cmsToken?: string;
	}

	interface Session extends DefaultSession {
		cmsToken?: string;
	}
}

declare module '@auth/core/jwt' {
	interface JWT extends DefaultJWT {
		cmsToken?: string;
	}
}
