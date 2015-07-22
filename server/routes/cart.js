var mongojs = require('mongojs');
var db = require('../db/connection.js');
var respHandler = require('../utils/responseHandler.js');

var CartAPI = {

    // explicitly request for cart data
    viewCart: function(req, res) {
        var id = req.params.id;
        var cart = [];

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
            }

            user.cart = user.cart || [];

            db.books.find({}, function(err, books) {

                for (var i = 0; i < books.length; i++) {
                    var book = books[i];
                    user.cart.forEach(function(item) {
                     console.log(book._id == item.id)
                   
                        if (item.id == book._id) {
                            var _item = book;
                            _item.qty = item.qty;
                            cart.push(_item);
                            return false;
                        }
                    })
                };
                // res, status, data, message, err
                respHandler(res, 200, cart, 'Success', null);
            });


        });
    },

    addToCart: function(req, res) {
        // user id
        var id = req.params.id;
        var bookDetails = req.body; // book id, qty

        if (!id || !bookDetails) {
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


            var cartItems = dbUser.cart || [];



            if (cartItems.length === 0) {
                cartItems.push(bookDetails);
            } else {
                for (var i = 0; i < cartItems.length; i++) {
                    if (cartItems[i].id == bookDetails.id) {
                        var qty = parseInt(cartItems[i].qty);
                        cartItems[i].qty = qty + parseInt(bookDetails.qty);
                        bookDetails = null;
                    }
                };

                if (bookDetails) {
                    cartItems.push(bookDetails);
                }
            }

            dbUser.cart = cartItems;

            db.users.save(dbUser, function(err, user) {
                if (err) {
                    // res, status, data, message, err
                    respHandler(res, 500, null, 'Oops something went wrong', err);
                    return;
                }
                // res, status, data, message, err
                respHandler(res, 200, cartItems, 'Success', null);
            });
        });


    }

}

module.exports = CartAPI;
