/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com", // Firebase storage domain
      "lh3.googleusercontent.com", // Google user profile images domain
    ],
  },
};

export default nextConfig;
