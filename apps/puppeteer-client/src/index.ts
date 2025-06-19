import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export async function takeScreenshot(url: string): Promise<{ filePath: string; base64: string }> {
    if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) {
        throw new Error('Invalid or missing URL');
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });

    const imageBuffer = await page.screenshot({
        encoding: 'binary',
        fullPage: true, // ✅ chụp toàn trang
    });

    await browser.close();

    // Lưu file vào thư mục images
    const fileName = `screenshot_${Date.now()}.png`;
    const filePath = path.join(__dirname, '../images', fileName);
    fs.writeFileSync(filePath, imageBuffer);

    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    return { filePath, base64: imageBase64 };
}
