const express = require('express');
const path = require('path');
const dbData = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
    
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get("/api/notes", (req, res) => res.json(dbData));

app.post("/api/notes", (req, res) => {

    //Destructure req.body
    const { title, text } = req.body;
    // If title and text are present...
    if (title && text) {
        //create a variable containing newNote object
        const newNote = {
            title,
            text
        };

        console.log(newNote);
    }

});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});
