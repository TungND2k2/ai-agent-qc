// Điều phối logic test: Gửi link + ảnh sang GPT để phân tích UI
import axios from 'axios';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import { takeScreenshot } from '../../puppeteer-client/src/index'; // Import hàm chụp ảnh từ puppeteer client
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function testUIService(url: string): Promise<{ aiResult: string; screenshotPath: string }> {
    try {
        if (!/^https?:\/\/.+/i.test(url)) {
            throw new Error('URL không hợp lệ');
        }

        console.log('[Agent] Gửi URL cho GPT để phân tích:', url);

        // Chụp ảnh trang bằng hàm dùng chung
        const { filePath: screenshotPath, base64 } = await takeScreenshot(url);

        // Gửi yêu cầu GPT phân tích nội dung với base64
        const response = await openai.responses.create({
            model: 'gpt-4.1-mini',
            input: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text', text: `Bạn hãy xem giao diện trong ảnh sau và cho biết:
                            - Đây là màn hình gì?
- Chức năng chính là gì?
- Các nút / form / thành phần UI có rõ ràng không?
- Có vấn đề gì về UI/UX hoặc logic không?`
                        },
                        {
                            type: 'input_image',
                            image_url: `data:image/png;base64,${base64}`,
                            detail: 'auto',
                        },
                    ],
                },
            ],
        });

        const aiOutput = response.output_text?.trim();

        return {
            aiResult: aiOutput || 'Không có phản hồi từ AI.',
            screenshotPath,
        };
    } catch (err: any) {
        console.error('❌ Lỗi trong testUIService:', err?.response?.data || err.message || err);
        throw new Error('Không thể xử lý yêu cầu test UI.');
    }
}
