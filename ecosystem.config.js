module.exports = {
  apps: [
    {
      name: 'dev:all',
      script: './dev-all.sh',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
