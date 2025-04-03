import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Đọc API key từ biến môi trường

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Vui lòng nhập tin nhắn!" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: userMessage }] }] })
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error("Lỗi khi kết nối API:", error);
        res.status(500).json({ error: "Lỗi khi kết nối API!" });
    }
});

app.get('/', (req, res) => {
    res.send('Server đang chạy');
});

app.listen(3000, () => console.log("Server đang chạy tại http://localhost:3000"));
