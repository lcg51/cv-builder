import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**'
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '1337',
				pathname: '/uploads/**'
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
	rewrites: async () => {
		return [
			{
				source: '/cms-api/:path*',
				destination: `${process.env.NEXT_PUBLIC_CMS_API_URL || 'https://portfolio-cms-beige-eta.vercel.app'}/api/:path*`
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
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

export default withNextIntl(nextConfig);
