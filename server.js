const express = require('express');
const path = require('path');
const router = require('express').Router();
const fs = require('fs');
const util = require('util');
const uuid = require('./helpers/uuid');
const db = require('.db/db.json');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) => {
    console.log('notes');
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET Route for homepage
app.get('*', (req, res) => {
    console.log('get *');
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

module.exports = router;