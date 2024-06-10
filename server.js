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

app.get('/reload', (req, res) => {
    res.status(200).send({ message: "Success" });
});

const PORT = process.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

setInterval(() => {
    fetch('http://localhost:3000/reload').then(response => response.json()).then(data => console.log(data.message));
}, 5000);