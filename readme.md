# UI QC Agent - Monorepo

## 📦 Tổng quan
Hệ thống tự động kiểm thử UI theo góc nhìn người dùng, sử dụng bot Discord để điều khiển một chuỗi xử lý gồm backend, trình duyệt mô phỏng bằng Puppeteer và GPT-4 Vision để phân tích ảnh giao diện.

## 📁 Cấu trúc thư mục
```
ui-qc-agent/
├── apps/
│   ├── discord-bot/
│   │   ├── src/
│   │   │   ├── main.ts          // Khởi tạo bot và đăng ký lệnh
│   │   │   └── handler.ts       // Xử lý lệnh Discord
│   │   └── tsconfig.json
│   ├── agent-backend/
│   │   ├── src/
│   │   │   ├── main.ts          // Entry NestJS hoặc Express
│   │   │   └── service.ts       // Điều phối logic test: gọi puppeteer + GPT
│   │   └── tsconfig.json
│   └── puppeteer-client/
│       ├── src/
│       │   └── index.ts         // Puppeteer: mở web, chụp ảnh, click
│       └── tsconfig.json
├── shared/
│   └── types/
│       └── test-request.dto.ts // Interface request/response chung
├── package.json                // Root workspace
├── tsconfig.json              // TS config chung
├── .env                       // Biến môi trường dùng chung
└── README.md
```

## 🚀 Các thư viện chính & Phiên bản khuyến nghị

### 🧠 Discord Bot (`apps/discord-bot`)
```json
{
  "discord.js": "^14.14.1",
  "dotenv": "^16.4.5",
  "axios": "^1.6.8"
}
```
- Slash commands, gửi message, embed

### 🧪 Agent Backend (`apps/agent-backend`)
```json
{
  "@nestjs/core": "^10.2.7",
  "@nestjs/common": "^10.2.7",
  "@nestjs/platform-express": "^10.2.7",
  "axios": "^1.6.8",
  "dotenv": "^16.4.5"
}
```
- Điều phối: nhận request từ bot → gọi Puppeteer + GPT Vision

### 🌐 Puppeteer Client (`apps/puppeteer-client`)
```json
{
  "puppeteer": "^22.6.3",
  "dotenv": "^16.4.5"
}
```
- Truy cập URL, chụp ảnh, thực thi click, gửi ảnh về backend

### 📷 GPT-4 Vision (qua `axios` REST API)
- Không cần SDK riêng, chỉ gọi `https://api.openai.com/v1/chat/completions` với `model: gpt-4-vision-preview`
- Header phải có: `Authorization: Bearer <OPENAI_API_KEY>`

## 📦 Root `package.json` (monorepo)
```json
{
  "name": "ui-qc-agent",
  "private": true,
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "dev:bot": "ts-node apps/discord-bot/src/main.ts",
    "dev:backend": "ts-node apps/agent-backend/src/main.ts",
    "dev:puppeteer": "ts-node apps/puppeteer-client/src/index.ts",
    "dev:all": "concurrently \"npm run dev:bot\" \"npm run dev:backend\" \"npm run dev:puppeteer\""
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "ts-node": "^10.9.2",
    "concurrently": "^8.2.2"
  }
}
```

## 🛠 Cài đặt & chạy local
```bash
# Cài tất cả
npm install

# Tạo file .env
cp .env.example .env

# Chạy từng service hoặc đồng thời
npm run dev:all
```

## 🌐 .env
```env
DISCORD_BOT_TOKEN=xxx
OPENAI_API_KEY=sk-...
```

## 💡 Gợi ý flow xử lý
1. Discord bot nhận lệnh `/test-ui`
2. Gửi request (REST) đến backend kèm URL, mode, tiêu chí
3. Backend gọi puppeteer-client thực thi thao tác và chụp ảnh
4. Gửi ảnh sang OpenAI Vision API → lấy đánh giá UI
5. Trả kết quả về lại Discord

---

## ✅ Copilot hiểu gì?
- Tách rõ service, có comment và mô tả cho từng file
- Đặt tên rõ nghĩa: `test-request.dto.ts`, `handler.ts`, `service.ts`
- Dùng chuẩn cấu trúc monorepo cho TypeScript
- Package và version cố định, dễ auto-suggest

---