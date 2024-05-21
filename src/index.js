require('reflect-metadata');
const express = require('express');
const { createConnection } = require('typeorm');
const { identify } = require('./controllers/identifyController');
const ormconfig = require('../ormconfig');

const app = express();
app.use(express.json());

createConnection(ormconfig).then(() => {
    app.post('/identify', identify);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log(error));
