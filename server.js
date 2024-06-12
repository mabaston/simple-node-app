const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const app = express();

const eventRouters = require('./routers/event-routers');

app.use('/products', express.static(path.join(__dirname, 'web-pages', 'products-page')));
app.use('/home', express.static(path.join(__dirname, 'web-pages', 'home-page')));

app.use('/', eventRouters);

const PORT = process.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

setInterval(() => {
    fetch('https://simple-node-app-nktc.onrender.com/reload').then(response => response.json()).then(data => console.log(data.message));
}, 5000);