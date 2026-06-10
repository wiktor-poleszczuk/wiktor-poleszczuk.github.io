var express = require('express');
var router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, '..', 'data.db');
const db = new DatabaseSync(dbPath);

// lista utworów
router.get('/', function(req, res, next) {
    try {
        const query = db.prepare('SELECT * FROM song');
        const songs = query.all();
        res.render('song/index', { title: 'Song List', bodyClass: 'index', songs: songs });
    } catch (err) {
        next(err);
    }
});

// formularz tworzenia
router.get('/create', function(req, res) {
    res.render('song/create', { title: 'Create Song', bodyClass: 'edit', song: null });
});

// zapis nowego utworu
router.post('/create', function(req, res, next) {
    try {
        const { title, artist, duration } = req.body;
        const statement = db.prepare('INSERT INTO song (title, artist, duration) VALUES (?, ?, ?)');
        statement.run(title, artist, parseInt(duration));
        res.redirect('/songs');
    } catch (err) {
        next(err);
    }
});

// podglad utworu (show)
router.get('/:id', function(req, res, next) {
    try {
        const query = db.prepare('SELECT * FROM song WHERE id = ?');
        const song = query.get(parseInt(req.params.id));
        if (!song) {
            return res.status(404).send('Missing song');
        }
        res.render('song/show', { title: song.title, bodyClass: 'show', song: song });
    } catch (err) {
        next(err);
    }
});

// formularz edycji
router.get('/:id/edit', function(req, res, next) {
    try {
        const query = db.prepare('SELECT * FROM song WHERE id = ?');
        const song = query.get(parseInt(req.params.id));
        if (!song) {
            return res.status(404).send('Missing song');
        }
        res.render('song/edit', { title: 'Edit Song', bodyClass: 'edit', song: song });
    } catch (err) {
        next(err);
    }
});

// zapisanie edycji
router.post('/:id/edit', function(req, res, next) {
    try {
        const { title, artist, duration } = req.body;
        const statement = db.prepare('UPDATE song SET title = ?, artist = ?, duration = ? WHERE id = ?');
        statement.run(title, artist, parseInt(duration), parseInt(req.params.id));
        res.redirect('/songs');
    } catch (err) {
        next(err);
    }
});

// usuwanie
router.post('/:id/delete', function(req, res, next) {
    try {
        const statement = db.prepare('DELETE FROM song WHERE id = ?');
        statement.run(parseInt(req.params.id));
        res.redirect('/songs');
    } catch (err) {
        next(err);
    }
});

module.exports = router;