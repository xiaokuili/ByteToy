/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [{ hostname: 'fjord.dropboxstatic.com' }],
    },
    output: 'standalone',
};
export default nextConfig;
