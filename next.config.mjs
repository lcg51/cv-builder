/** @type {import('next').NextConfig} */
const nextConfig = {
	redirects: async () => {
		return [
			{
				source: '/admin',
				destination: '/admin/resume',
				permanent: true
			}
		];
	}
};

export default nextConfig;
