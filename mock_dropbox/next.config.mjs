/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [{ hostname: 'fjord.dropboxstatic.com' }],
    },
};
export default nextConfig;
