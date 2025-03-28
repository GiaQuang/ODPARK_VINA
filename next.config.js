/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    output: "export",
    images: { unoptimized: true },
    reactStrictMode: false, // Bật React.StrictMode, tạm bật để test
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;
