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
				source: '/home',
				destination: '/',
				permanent: true
			}
		];
	},
	turbopack: {
		// Example: adding an alias and custom file extension
		resolveAlias: {
			underscore: 'lodash'
		},
		resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json']
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = { fs: false };
		}
		return config;
	}
};

export default nextConfig;
