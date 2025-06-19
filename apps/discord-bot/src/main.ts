// Khởi tạo bot và đăng ký lệnh
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { handleCommand } from './handler';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

async function registerSlashCommand() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);
  try {
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      {
        body: [
          {
            name: 'test-ui',
            description: 'Kiểm thử UI website với AI',
            options: [
              {
                name: 'url',
                description: 'Đường dẫn website',
                type: 3, // STRING
                required: true
              }
            ]
          }
        ]
      }
    );
    console.log('Slash command /test-ui registered!');
  } catch (err) {
    console.error('Failed to register slash command:', err);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  await registerSlashCommand();
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log('Received slash command:', interaction.commandName);
    await handleCommand(interaction);
  } else {
    console.log('Received interaction of type:', interaction.type);
  }
});

// client.on('messageCreate', (message) => {
//   console.log(`Received message: ${message.content} from ${message.author.displayName}`);
// });

client.login(process.env.DISCORD_BOT_TOKEN);
