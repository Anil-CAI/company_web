/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local media only — placeholders live in /public. Add remote patterns here
    // if media is ever served from a CDN.
    formats: ['image/avif', 'image/webp'],
  },
  eslint: {
    dirs: ['app', 'components', 'sections', 'hooks', 'lib', 'utils', 'data', 'types', 'constants'],
  },
};

export default nextConfig;
