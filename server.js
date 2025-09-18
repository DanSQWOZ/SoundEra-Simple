js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
destination: (req, file, cb) => cb(null, uploadDir),
filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// отдаём index.html и статику
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

app.get('/tracks', (req, res) => {
const files = fs.readdirSync(uploadDir).map(f => ({
name: f,
url: '/uploads/' + encodeURIComponent(f)
}));
res.json(files.reverse());
});

app.post('/upload', upload.single('track'), (req, res) => {
if (!req.file) return res.status(400).json({ error: 'Нет файла' });
res.json({ ok: true });
});

app.listen(PORT, () => console.log('SoundEra simple running on', PORT));
