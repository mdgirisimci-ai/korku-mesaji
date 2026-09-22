const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "numbers.json");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
}

app.post("/api/register", (req, res) => {
    const { phone, communicationConsent } = req.body;

    if (!phone || !communicationConsent) {
        return res.status(400).json({
            success: false,
            message: "Telefon ve açık iletişim onayı gerekli."
        });
    }

    const list = JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );

    list.push({
        phone,
        communicationConsent: true,
        createdAt: new Date().toISOString()
    });

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(list, null, 2)
    );

    res.json({
        success: true,
        message: "Listeye eklendiniz."
    });
});

app.get("/api/list", (req, res) => {
    const list = JSON.parse(
        fs.readFileSync(DATA_FILE, "utf8")
    );

    res.json(list);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});