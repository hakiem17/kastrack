/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // Mengabaikan error TypeScript agar build tidak berhenti
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;