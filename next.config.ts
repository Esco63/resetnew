import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Node-Bibliotheken für den Mail-Abruf nicht bündeln
  serverExternalPackages: ["imapflow", "mailparser"],
};

export default nextConfig;
