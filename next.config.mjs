/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "valiant-partridge-243.convex.cloud" },
			{ hostname: "harmless-orca-836.convex.cloud" },
		],
	},
};

export default nextConfig;
