const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Utilise la variable d'environnement sur Render ou ta clé en local
const apiKey = process.env.API_KEY || "TA_CLE_GOOGLE_ICI";
const genAI = new GoogleGenerativeAI(apiKey);

app.post('/chat', async (req, res) => {
    const { prompt, image } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let parts = [prompt || "Analyse cette image"];

        if (image) {
            parts.push({
                inlineData: { data: image, mimeType: "image/jpeg" }
            });
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Désolé, SamyAI rencontre un problème technique." });
    }
});

const PORT = process.env.PORT || 3000;
// Cette ligne dit au serveur d'afficher ton fichier index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(PORT, () => console.log(`SamyAI actif sur le port ${PORT}`));
