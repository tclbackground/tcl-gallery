module.exports = {
  apps: [
    {
      name: "tcl-gallery",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "D:/Chinmayi/tcl-gallery",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};