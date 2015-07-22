var mongojs = require('mongojs');
//var db = mongojs('mongodb://admin:admin123@ds031962.mongolab.com:31962/ionicbookstoreapp', ['users', 'books']);
var db = mongojs('ionicbookstoreapp', ['users', 'books']);

// Add a unique index
db.users.ensureIndex({
    email: 1
}, {
    unique: true
});

module.exports = db;
