/** @type {import('next').NextConfig} */
const nextConfig = {
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/home',
				permanent: true
			}
		];
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = { fs: false };
		}
		return config;
	}
};

export default nextConfig;
