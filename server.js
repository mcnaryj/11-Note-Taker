const express = require('express');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const util = require('util');

// importing uuid and db.json
const uniqid = require('uniqid');
const db = require('./db/db.json');

// setting the environment variable
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// GET Route for notes page
app.get('/notes', (req, res) => {
    console.log("notes");
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET Route for homepage
router.get('*', (req, res) => {
    console.log("* route");
    res.sendFile(path.join(__dirname, './public/index.html'));
})

const readFromFile = util.promisify(fs.readFile);

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


app.post('/api/notes', (req, res) => {
    // log the request method
    console.info(`${req.method} request received`);
    // declare a constant
    const newNote = { title, text } = req.body;
    // if req.body contains addNote with the title, text and a unique id
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uniqid(),
        };
        // then we read and append the new note from the db.json file
        // and the response is res.json(addNote)
        readAndAppend(newNote, './db/db.json');
        res.json(newNote);
    }
});


// DELETE /api/notes/:id

// heroku hosts our application on the cloud

// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

