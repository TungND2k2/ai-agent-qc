module.exports = {
  apps: [
    {
      name: 'dev:all',
      script: '/root/.nvm/versions/node/v22.11.0/bin/node',
      args: '/root/.nvm/versions/node/v22.11.0/lib/node_modules/npm/bin/npx-cli.js concurrently -n "BOT,BACKEND,PTR" -c "cyan,green,magenta" "npm run dev:bot" "npm run dev:backend" "npm run dev:puppeteer"',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
