var mongojs = require('mongojs');
var db = require('../db/connection.js');
var respHandler = require('../utils/responseHandler.js');

var PurchasesAPI = {
    viewPurchases: function(req, res) {
        var id = req.params.id;
        var popPurchases = [];

        if (!id) {
            // res, status, data, message, err
            respHandler(res, 400, null, 'Invalid input', 'Invalid input');
            return;
        }

        db.users.findOne({
            _id: mongojs.ObjectId(id)
        }, function(err, user) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong', err);
                return;
            } else if (!user) {
                // res, status, data, message, err
                respHandler(res, 403, null, 'Invalid User', 'Invalid User');
                return;
            }

            user.purchases = user.purchases || [];

            db.books.find(function(err, books) {
                if (err) {
                    // res, status, data, message, err
                    respHandler(res, 500, null, 'Oops something went wrong', err);
                    return;
                }

                var purchases = user.purchases;
                for (var i = 0; i < purchases.length; i++) {
                    var _purchase = [];
                    var purchase = purchases[i];
                    var key = Object.keys(purchase)[0];
                    var booksInPurchase = purchase[key];

                    for (var j = 0; j < booksInPurchase.length; j++) {
                        var book = booksInPurchase[j];
                        loop:
                            for (var k = 0; k < books.length; k++) {
                                if (books[k]._id == book.id) {
                                    var _book = books[k];
                                    _book.qty = book.qty;
                                    _purchase.push(_book);
                                    break loop;
                                }
                            };
                    };
                    var o = {};
                    o[key] = _purchase;
                    popPurchases.push(o);
                };

                // res, status, data, message, err
                respHandler(res, 200, popPurchases, 'Success', null);
            });

        });
    },

    makePurchase: function(req, res) {
        var id = req.params.id;
        var purchase = req.body;

        if (!id || !purchase) {
            // res, status, data, message, err
            respHandler(res, 400, null, 'Invalid input', 'Invalid input');
            return;
        }

        if (!(purchase instanceof Array)) {
            // res, status, data, message, err
            respHandler(res, 400, null, 'Invalid input', 'Invalid input');
            return;
        }

        db.users.findOne({
            _id: mongojs.ObjectId(id)
        }, function(err, dbUser) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong', err);
                return;
            } else if (!dbUser) {
                // res, status, data, message, err
                respHandler(res, 403, null, 'Invalid User', 'Invalid User');
                return;
            }

            dbUser.cart = [];
            dbUser.purchases = dbUser.purchases || [];

            var _purchase = {};
            _purchase[getPurchaseString()] = purchase

            dbUser.purchases = dbUser.purchases.concat(_purchase);

            db.users.save(dbUser, function(err, resp) {
                if (err) {
                    // res, status, data, message, err
                    respHandler(res, 500, null, 'Oops something went wrong', err);
                    return;
                }
                // res, status, data, message, err
                respHandler(res, 200, dbUser.purchases, 'Success', null);
            });

        });

    }
};

function getPurchaseString() {
    var monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'
    ];

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    return ('Purchase made on ' + day + '-' + monthNames[monthIndex] + '-' + year + ' at ' + hours + ':' + minutes);
}

module.exports = PurchasesAPI;
