/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [{ hostname: 'fjord.dropboxstatic.com' }],
    },
};
export default nextConfig;
