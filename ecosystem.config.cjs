module.exports = {
  apps: [
    {
      name: "tool_video-fe",
      script: ".output/server/index.mjs",
      interpreter: "node",
      env: {
        NODE_ENV: "production",

        NITRO_PORT: 51025,
        NITRO_HOST: "0.0.0.0",

        VITE_API_URL: "https://api.tnsolve.com",
      },
    },
  ],
};
