/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**'
			}
		]
	},
	serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
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
