module.exports = {
  apps: [
    {
      name: 'ui-qc-agent',
      script: 'npm',
      args: 'run dev:all',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};