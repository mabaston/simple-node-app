const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

const app = express();

app.use(express.static(path.join(__dirname, 'main-page')));

app.get('/home', (req, res) => {
    res.status(200);
    res.send('<h1>Welcome</h1>');
});

app.get('/products', (req, res) => {
    console.log('Logged');
    res.status(200);
    res.sendFile(path.join(__dirname, 'main-page', 'index.html'));
});

const PORT = process.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));