import { ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { testUIService } from '../../agent-backend/src/service';

function saveTextToFile(content: string): string {
  const fileName = `result_${randomUUID()}.txt`;
  const filePath = path.join(__dirname, '../../saved-results', fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function safeDelete(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Đã xoá file: ${filePath}`);
    }
  } catch (err) {
    console.error('❌ Lỗi xoá file:', err);
  }
}

export async function handleCommand(interaction: ChatInputCommandInteraction) {
  if (interaction.commandName === 'test-ui') {
    const url = interaction.options.getString('url', true);
    await interaction.reply('🔍 Đang kiểm thử UI cho trang: ' + url);

    let textFilePath: string | undefined;
    let screenshotPath: string | undefined;

    try {
      const result = await testUIService(url);
      const { aiResult } = result;
      screenshotPath = result.screenshotPath;
      const files: AttachmentBuilder[] = [];

      if (screenshotPath && fs.existsSync(screenshotPath)) {
        files.push(new AttachmentBuilder(screenshotPath, { name: path.basename(screenshotPath) }));
      }

      if (typeof aiResult === 'string' && aiResult.length > 2000) {
        textFilePath = saveTextToFile(aiResult);
        files.push(new AttachmentBuilder(textFilePath, { name: path.basename(textFilePath) }));

        await interaction.followUp({
          content: '📎 Kết quả quá dài nên gửi file đính kèm kèm ảnh:',
          files,
        });
      } else {
        await interaction.followUp({
          content: `📋 **Kết quả GPT:**\n${aiResult}`,
          files,
        });
      }
    } catch (err) {
      console.error('❌ Lỗi khi gọi backend:', err);
      await interaction.followUp('❌ Có lỗi xảy ra khi kiểm thử UI.');
    } finally {
      // ✅ Dọn file sau khi gửi xong
      if (textFilePath) safeDelete(textFilePath);
      if (screenshotPath) safeDelete(screenshotPath);
    }
  }
}
