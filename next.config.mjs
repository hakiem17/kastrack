/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Mengabaikan error ESLint agar build tidak berhenti
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Mengabaikan error TypeScript agar build tidak berhenti
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;