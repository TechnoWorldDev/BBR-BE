module.exports = {
    apps: [
      {
        name: "nestjs-app",
        script: "dist/src/main.js",
        exec_mode: "cluster",
        instances: "max",
        autorestart: true,
        watch: false,
      },
    ],
  };
  