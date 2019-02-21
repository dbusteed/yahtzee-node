const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const port = 3000;

// EJS for templating
app.set('view engine', 'ejs');

// static files (client JS, CSS) found in public
app.use('/', express.static(__dirname + '/public'));

// "body parser" used for getting post
// request, may be deprecated
app.use(express.json());       
app.use(express.urlencoded({ extended: true }));

// define the database object
let db = new sqlite3.Database('./data.db');

let selectSQL = `SELECT name, score, date FROM Score;`;

// GET request for the page
app.get('/', (req, res) => {

    db.all(selectSQL, [], (err, rows) => {
        if (err) {
            throw err;
        }

        d = new Date();
        currentMonth = d.getFullYear() + "-" + (d.getMonth()+1);

        allTime = [];
        recent = [];

        allTime = rows.sort( (a,b) => { return b.score - a.score } ).slice(0,10);
        recent = rows.filter( (rec) => { if(rec.date.includes(currentMonth)) { return rec; } } ).slice(0,10);

        res.render('index', {allTime: allTime, recent: recent});
        
    });
});

// POST request for saving high score
app.post('/saveScore', (req, res) => {

    // create a date string for saving
    d = new Date()
    date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        
    let insertSQL = `INSERT INTO Score(name, score, date) VALUES('${req.body.name}', ${req.body.score}, '${date}');`;

    db.run(insertSQL, [], (err) => {
        if(err) {
            console.error(err);
        }
    });

    res.redirect('/'); // TODO make this refresh the page too so that new scores show
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
});