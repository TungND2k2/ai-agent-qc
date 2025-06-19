// Entry NestJS hoặc Express
import express from 'express';
import dotenv from 'dotenv';
import { testUIService } from './service';
import path from 'path';
dotenv.config();

const app = express();
app.use(express.json());

// Expose static images folder
app.use('/images', express.static(path.join(__dirname, '../../../puppeteer-client/images')));

app.post('/test-ui', async (req, res) => {
    const { url } = req.body;
    try {
        const result = await testUIService(url);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: 'Lỗi backend' });
    }
});

app.listen(3000, () => console.log('Backend listening on 3000'));
