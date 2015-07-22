var jwt = require('jwt-simple');
var db = require('../db/connection.js');
var pwdMgr = require('../utils/managePassword.js');
var respHandler = require('../utils/responseHandler.js');

var auth = {

    register: function(req, res) {
        var user = req.body;
        var email = user.email || '';
        var password = user.password || '';

        // name is optional
        if (email.trim() == '' || password.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Invalid Credentials', 'Invalid Credentials');
            return;
        }

        pwdMgr.cryptPassword(user.password, function(err, hash) {
            user.password = hash;
          
            db.users.insert(user, function(err, dbUser) {
                if (err) {
                    /* http://www.mongodb.org/about/contributors/error-codes/*/
                    if (err.code == 11000) {
                        // duplicate key error
                        // res, status, data, message, err
                        respHandler(res, 400, null, 'A user with this email already exists', 'A user with this email already exists');
                        return;
                    } else {
                        // res, status, data, message, err
                        respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                        return;
                    }
                } else {
                    delete dbUser.password;

                    // res, status, data, message, err
                    respHandler(res, 200, genToken(dbUser), 'Success', null);
                }

            });
        });
    },

    login: function(req, res) {
        var user = req.body;
        var email = user.email || '';
        var password = user.password || '';

        if (email.trim() == '' || password.trim() == '') {
            // res, status, data, message, err
            respHandler(res, 401, null, 'Invalid Credentials', 'Invalid Credentials');
            return;
        }


        db.users.findOne({
            email: email
        }, function(err, dbUser) {
            if (err) {
                // res, status, data, message, err
                respHandler(res, 500, null, 'Oops something went wrong while processing your credentials', err);
                return;
            } else if (!dbUser) {
                // res, status, data, message, err
                respHandler(res, 403, null, 'Invalid User credentials', 'Invalid User credentials');
                return;
            }
            // we found one user, let's validate the password now
            pwdMgr.comparePassword(user.password, dbUser.password, function(err, isPasswordMatch) {
                if (isPasswordMatch) {
                    delete dbUser.password;
                    // res, status, data, message, err
                    respHandler(res, 200, genToken(dbUser), 'Success', null);
                } else {
                    // res, status, data, message, err
                    respHandler(res, 403, null, 'Invalid User credentials', 'Invalid User credentials');
                }
                return;
            });

        });
    },

    validate: function(id, callback) {

        db.users.findOne({
            _id: require('mongojs').ObjectId(id)
        }, callback);

    }

}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        user: user,
    }, require('../utils/secret'));
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
