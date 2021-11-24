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
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
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


// DELETE / api / notes /: id
app.delete('/api/notes/:id', (req, res) => {
    // we want the userid
    const userId = req.params.id;
    console.log(req.params.id)

    // then we want to read from the db json file, promise the return of the data, then parse that data in the fxn
    readFromFile('./db/db.json').then((data) => JSON.parse(data))
        // then with our notes variable, we want to filter it, and check to see that the note does not match the id
        .then((notes) => notes.filter((note) => note.id !== userId))
        // writing the filtered note to the db.json
        .then((filteredNotes) => writeToFile('./db/db.json', filteredNotes))
        .then(() => res.json({ ok: true }))

        // a catch error function to return a 500 error if we enter the wrong id
        .catch((err) => res.status(500).json(err))
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);