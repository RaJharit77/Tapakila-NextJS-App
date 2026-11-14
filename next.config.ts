import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "*" },
                ],
            },
        ];
    },
    images: {
        loader: 'default',
        qualities: [75, 80],
        remotePatterns: [
            { protocol: 'https', hostname: '**.cloudinary.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'imagedelivery.net' },
            { protocol: 'https', hostname: 'picsum.photos' },
        ],
    },
};

export default nextConfig;