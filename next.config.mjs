/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts'],
    },
};

export default nextConfig;