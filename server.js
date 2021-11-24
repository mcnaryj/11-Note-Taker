const express = require('express');
const path = require('path');
const router = require('express').Router();
const fs = require('fs');
const util = require('util');

const uuid = require('./helpers/uuid');
const db = require('./db/db.json');

// setting the environment variable
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) => {
    console.log("notes");
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET Route/catchall for homepage
app.get('*', (req, res) => {
    console.log("get *");
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

module.exports = router;

const readFromFile = util.promisify(fs.readFile);

// 
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`Written to ${destination}`)
    );


const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

app.get('/api/notes', (req, res) =>
    readFromFile('.db/db.json').then((data) => res.json(JSON.parse(data)))
);