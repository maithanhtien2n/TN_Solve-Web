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

        VITE_GOOGLE_CLIENT_ID:
          "681037770554-al2b5mj25ch8amdjpirl6gti75sqc3kd.apps.googleusercontent.com",
      },
    },
  ],
};
