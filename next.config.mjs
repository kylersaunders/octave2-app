/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/spotify/auth',
        destination: 'https://accounts.spotify.com/authorize',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
