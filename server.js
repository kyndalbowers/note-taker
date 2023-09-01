const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');

app.use(express.json());

app.use(express.static('Develop/public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const notes = JSON.parse(data);

        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile('Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error'});
        }

    const notes = JSON.parse(data);

    const newNote = req.body;

    newNote.id = Date.now();

    notes.push(newNote);

    fs.writeFile('Develop/db/db.json', JSON.stringify(notes), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error'});
        }

    res.json(newNote);
    
    });
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Develop/public/index.html');
});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/Develop/public/notes.html');
});

app.delete('/api/notes/:id', (req, res) => {
    const noteIdToDelete = parseInt(req.params.id);

    fs.readFile('Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        const notes = JSON.parse(data);

        const noteIndex = notes.findIndex(note => note.id === noteIdToDelete);

        if (noteIndex !== -1) {
            notes.splice(noteIndex, 1);

            fs.writeFile('Develop/db/db.json', JSON.stringify(notes), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.sendStatus(204);
            });
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log('Server listening on http://localhost:${PORT}');
});