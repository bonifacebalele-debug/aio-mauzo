const path = require("path");

module.exports = {
  apps: [
    {
      name: "aio-invoice-frontend",
      cwd: __dirname,
      script: path.join(__dirname, "node_modules", "next", "dist", "bin", "next"),
      args: "dev",
      interpreter: "node",
      autorestart: true,
      watch: false,
      max_restarts: 20,
      restart_delay: 2000,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
