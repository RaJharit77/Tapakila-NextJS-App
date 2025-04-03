import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "*",
                    },
                ],
            }
        ];
    },
    images: {
        domains: ["imagedelivery.net"],
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
            }
        ]
    },
    /*eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    }*/
};

export default nextConfig;
