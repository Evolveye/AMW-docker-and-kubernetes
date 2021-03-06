import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config:BlitzConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  middleware: [
    sessionMiddleware({
      cookiePrefix: `module-base`,
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  env: {
    CHAT_URL: process.env.CHAT_URL,
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config
