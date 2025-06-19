module.exports = {
  apps: [
    {
      name: 'dev:all',
      script: 'npx',
      args: 'concurrently -n "BOT,BACKEND,PTR" -c "cyan,green,magenta" "npm run dev:bot" "npm run dev:backend" "npm run dev:puppeteer"',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
