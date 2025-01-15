import withPWA from 'next-pwa';

const config = {
  reactStrictMode: true,
  images: {
    domains: ['api.fomovenue.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.fomovenue.com wss://api.fomovenue.com",
              "media-src 'none'",
              "object-src 'none'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "worker-src 'self'",
              "manifest-src 'self'",
              "base-uri 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
})(config);

export default nextConfig;