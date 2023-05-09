/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    //minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evttcntmeqfjqcbkxehl.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/gladius/image/fetch/**",
      },
    ],
    //loader: 'custom',
  },
};
