import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: 'pk.eyJ1IjoiYWNheiIsImEiOiJjbHRnNGN0cXUweXZqMmlwZjdpYWs0MXd1In0.m0at9KcpNrxMpIK_Ab_2aQ',
    NEXT_PUBLIC_API_BIO_URL: process.env.API_BIO_URL,
  }
};

export default nextConfig;
