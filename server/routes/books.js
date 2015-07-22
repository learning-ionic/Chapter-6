var db = require('../db/connection.js');
var respHandler = require('../utils/responseHandler.js');

var BooksAPI = {

    getAll: function(req, res) {
        var page = req.params.page || 1;
        var perPage = req.params.perPage || 10;

        page = parseInt(page);
        perPage = parseInt(perPage);

        var skip = page === 1 ? 0 : page * perPage;

        db.books.find().skip(skip).limit(perPage, function(err, books) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            } else {

                db.books.count(function(err, count) {
                    if (err) {
                        // res, status, data, message, err
                        respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                        return;
                    }

                    // res, status, data, message, err
                    respHandler(res, 200, {
                        count: count,
                        books: books
                    }, 'Success', null);

                });
            }
        });

    }

}

module.exports = BooksAPI;
