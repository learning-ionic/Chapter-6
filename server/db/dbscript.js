// run node dbscript.js to push the data to the db

var db = require('./connection.js');
var books = require('./data_generator.js');

db.books.insert(books, function(err, books) {
    if (err) {
        console.error(new Error(err));
    } else {
        console.log('Added', books.length, 'books!');
    }
    db.close();
});
