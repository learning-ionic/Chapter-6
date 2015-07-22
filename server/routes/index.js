var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var books = require('./books.js');
var cart = require('./cart.js');
var purchase = require('./purchase.js');
var path = require('path');
/*
 * Routes that can be accessed by any one
 */


/**
@api {post} /login User Login
@apiVersion 0.1.0
@apiName Login
@apiGroup User
@apiPermission none
@apiDescription This method takes a user's email address and password and authenticates the user. 
If the authentication is successful, the user object along with an access token will be sent back.

@apiParam {String} email User's Email address.
@apiParam {String} password User's Password.

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Object}    data   The response from the server.
@apiSuccess {String}    data.token   The access token, that needs to be sent with every API request.
@apiSuccess {Date}    data.expires   When the token would expire.
@apiSuccess {Object}    data.user   The authenticated user's details.
@apiSuccess {String}    data.user._id   Unique Id of the user.
@apiSuccess {String}    data.user.email   Email Address of the user.
@apiSuccess {String}    data.user.name   Name of the user.
@apiSuccess {Object[]}    data.user.cart   All the books added to the cart.
@apiSuccess {String}    data.user.cart.id   Unique ID of the book added to the cart.
@apiSuccess {String}    data.user.cart.qty   Quantity.
@apiSuccess {Object[]}    data.user.purchases   All the purchases the user 
@apiSuccess {Object[]}    data.user.purchases.key   This key is the handler for a purchase set.
@apiSuccess {String}    data.user.purchases.key.id   Unique ID of the book purchased.
@apiSuccess {String}    data.user.purchases.key.qty   Quantity.
@apiSuccess {String}     message          A message sent from the server.

@apiError (400 Bad Request) BadRequest If the request body does not contain email address or password
@apiError (401 Unauthorized) Unauthorized If the email address is valid and the passwords do not match
@apiError (403 Forbidden) Forbidden If an invalid email address is submitted
@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl --data "email=arvind@app.com&password=arvind123" https://ionic-book-store.herokuapp.com/login

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzM1MjIwNzQ4MzYsInVzZXIiOnsiX2lkIjoiNTU2ODU5NjgyN2ZjY2JjMTZkNjA4MzBiIiwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6ImEiLCJjYXJ0IjpbeyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlYSIsInF0eSI6MX1dLCJwdXJjaGFzZXMiOlt7IlB1cmNoYXNlIG1hZGUgb24gMjktTWF5LTIwMTUgYXQgMTc6NTAiOlt7ImlkIjoiNTU2ODNjZDhmYmIyZTE5MjRmMThhNGU4IiwicXR5IjoxfV19LHsiUHVyY2hhc2UgbWFkZSBvbiAyOS1NYXktMjAxNSBhdCAxNzo1OSI6W3siaWQiOiI1NTY4M2NkOGZiYjJlMTkyNGYxOGE0ZWIiLCJxdHkiOjF9LHsiaWQiOiI1NTY4M2NkOGZiYjJlMTkyNGYxOGE0ZjYiLCJxdHkiOjF9LHsiaWQiOiI1NTY4M2NkOGZiYjJlMTkyNGYxOGE0ZjgiLCJxdHkiOjF9XX0seyJQdXJjaGFzZSBtYWRlIG9uIDI5LU1heS0yMDE1IGF0IDIwOjUxIjpbeyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlOCIsInF0eSI6MX0seyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlYSIsInF0eSI6MX0seyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlZSIsInF0eSI6MX1dfV19fQ.J0U0BZXhP6C1VWEHDT18BMOzkK_dvXP-xdGUiIr7-z8",
        "expires": 1433522074836,
        "user": {
            "_id": "5568596827fccbc16d60830b",
            "email": "a@a.com",
            "name": "a",
            "cart": [
                {
                    "id": "55683cd8fbb2e1924f18a4ea",
                    "qty": 1
                }
            ],
            "purchases": [
                {
                    "Purchase made on 29-May-2015 at 17:50": [
                        {
                            "id": "55683cd8fbb2e1924f18a4e8",
                            "qty": 1
                        }
                    ]
                },
                {
                    "Purchase made on 29-May-2015 at 17:59": [
                        {
                            "id": "55683cd8fbb2e1924f18a4eb",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4f6",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4f8",
                            "qty": 1
                        }
                    ]
                },
                {
                    "Purchase made on 29-May-2015 at 20:51": [
                        {
                            "id": "55683cd8fbb2e1924f18a4e8",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4ea",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4ee",
                            "qty": 1
                        }
                    ]
                }
            ]
        }
    },
    "message": "Success"
}

@apiExample Response (Bad Request):
 HTTP/1.1 400 Bad Request
{
    "error": "Invalid Credentials",
    "data": null,
    "message": "Invalid Credentials"
}

@apiExample Response (Unauthorized):
 HTTP/1.1 401 Unauthorized
{
    "error": "Invalid User credentials",
    "data": null,
    "message": "Invalid User credentials"
}

@apiExample Response (Forbidden):
 HTTP/1.1 403 Forbidden
{
    "error": "Invalid User credentials",
    "data": null,
    "message": "Invalid User credentials"
}

@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong while processing your credentials"
}

 */
router.post('/login', auth.login);

/**
@api {post} /register User Registration
@apiVersion 0.1.0
@apiName Register
@apiGroup User
@apiPermission none
@apiDescription This method takes a user's email address, password & name and registers the user. 
If the registartion is successful, the user object along with an access token will be sent back.

@apiParam {String} email User's Email address.
@apiParam {String} password User's Password.
@apiParam {String} name User's Name.

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Object}    data   The response from the server.
@apiSuccess {String}    data.token   The access token, that needs to be sent with every API request.
@apiSuccess {Date}    data.expires   When the token would expire.
@apiSuccess {Object}    data.user   The authenticated user's details.
@apiSuccess {String}    data.user._id   Unique Id of the user.
@apiSuccess {String}    data.user.email   Email Address of the user.
@apiSuccess {String}    data.user.name   Name of the user.
@apiSuccess {Object[]}    data.user.cart   All the books added to the cart.
@apiSuccess {String}    data.user.cart.id   Unique ID of the book added to the cart.
@apiSuccess {String}    data.user.cart.qty   Quantity.
@apiSuccess {Object[]}    data.user.purchases   All the purchases the user 
@apiSuccess {String}    data.user.purchases.id   Unique ID of the book purchased.
@apiSuccess {String}    data.user.purchases.qty   Quantity.
@apiSuccess {String}     message          A message sent from the server.

@apiError (400 Bad Request) BadRequest If the request body does not contain email address or password
@apiError (409 Conflict) Conflict If a user already with same email address already exists
@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl --data "email=arvind@app.com&password=arvind123&name=Arvind" https://ionic-book-store.herokuapp.com/register

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzM1MjIwNzQ4MzYsInVzZXIiOnsiX2lkIjoiNTU2ODU5NjgyN2ZjY2JjMTZkNjA4MzBiIiwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6ImEiLCJjYXJ0IjpbeyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlYSIsInF0eSI6MX1dLCJwdXJjaGFzZXMiOlt7IlB1cmNoYXNlIG1hZGUgb24gMjktTWF5LTIwMTUgYXQgMTc6NTAiOlt7ImlkIjoiNTU2ODNjZDhmYmIyZTE5MjRmMThhNGU4IiwicXR5IjoxfV19LHsiUHVyY2hhc2UgbWFkZSBvbiAyOS1NYXktMjAxNSBhdCAxNzo1OSI6W3siaWQiOiI1NTY4M2NkOGZiYjJlMTkyNGYxOGE0ZWIiLCJxdHkiOjF9LHsiaWQiOiI1NTY4M2NkOGZiYjJlMTkyNGYxOGE0ZjYiLCJxdHkiOjF9LHsiaWQiOiI1NTY4M2NkOGZiYjJlMTkyNGYxOGE0ZjgiLCJxdHkiOjF9XX0seyJQdXJjaGFzZSBtYWRlIG9uIDI5LU1heS0yMDE1IGF0IDIwOjUxIjpbeyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlOCIsInF0eSI6MX0seyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlYSIsInF0eSI6MX0seyJpZCI6IjU1NjgzY2Q4ZmJiMmUxOTI0ZjE4YTRlZSIsInF0eSI6MX1dfV19fQ.J0U0BZXhP6C1VWEHDT18BMOzkK_dvXP-xdGUiIr7-z8",
        "expires": 1433522074836,
        "user": {
            "_id": "5568596827fccbc16d60830b",
            "email": "a@a.com",
            "name": "a",
            "cart": [
                {
                    "id": "55683cd8fbb2e1924f18a4ea",
                    "qty": 1
                }
            ],
            "purchases": [
                {
                    "Purchase made on 29-May-2015 at 17:50": [
                        {
                            "id": "55683cd8fbb2e1924f18a4e8",
                            "qty": 1
                        }
                    ]
                },
                {
                    "Purchase made on 29-May-2015 at 17:59": [
                        {
                            "id": "55683cd8fbb2e1924f18a4eb",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4f6",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4f8",
                            "qty": 1
                        }
                    ]
                },
                {
                    "Purchase made on 29-May-2015 at 20:51": [
                        {
                            "id": "55683cd8fbb2e1924f18a4e8",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4ea",
                            "qty": 1
                        },
                        {
                            "id": "55683cd8fbb2e1924f18a4ee",
                            "qty": 1
                        }
                    ]
                }
            ]
        }
    },
    "message": "Success"
}

@apiExample Response (Bad Request):
 HTTP/1.1 400 Bad Request
{
    "error": "Invalid Credentials",
    "data": null,
    "message": "Invalid Credentials"
}

@apiExample Response (Conflict):
 HTTP/1.1 409 Conflict
{
    "error": "A user with this email already exists",
    "data": null,
    "message": "A user with this email already exists"
}

@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong while processing your credentials"
}

 */
router.post('/register', auth.register);

/*
 * Routes that can be accessed only by autheticated users
 */


/**
@api {get} /api/v1/books/:page/:perPage Gets Books
@apiVersion 0.1.0
@apiName GetAllBooks
@apiGroup Books
@apiPermission none
@apiDescription This end point returns all the books in the store based on page number and perPage value
 
@apiParam {Number} page The page number of the books to be fetched
@apiParam {Number} perPage Number of books to fetch.

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Number}    count   Total records
@apiSuccess {Object[]}    data   The response from the server. An Array of books in store
@apiSuccess {String}    data._id   Unique id of the book.
@apiSuccess {String}    data.title   title of the book.
@apiSuccess {String}    data.author   author of the book.
@apiSuccess {String}    data.author_image   image of the author.
@apiSuccess {String}    data.short_description   short description of the book.
@apiSuccess {Date}    data.release_date   release date of the book.
@apiSuccess {String}    data.image   image of the book cover.
@apiSuccess {String}    data.price   price of the book.
@apiSuccess {String}    data.rating   rating of the book.
@apiSuccess {String}    data.long_description   long description of the book with currency.
@apiSuccess {String}     message          A message sent from the server.

@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl https://ionic-book-store.herokuapp.com/api/v1/books/1/10

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
      "data": [
        {
            "_id": "55683cd8fbb2e1924f18a505",
            "title": "impedit aut odio",
            "author": "Russ Gusikowski",
            "author_image": "https://s3.amazonaws.com/uifaces/faces/twitter/homka/128.jpg",
            "release_date": "2015-05-28T21:28:42.941Z",
            "image": "http://lorempixel.com/640/480/abstract?_r=683574436767",
            "price": "241",
            "short_description": "et sit rem vel aut corrupti at cupiditate pariatur",
            "rating": 3,
            "long_description": "commodi omnis accusamus sint maxime\nvoluptatem velit hic\nea consequatur dignissimos molestias mollitia voluptatem adipisci a cumque\nsit ex excepturi quis possimus perspiciatis illum\net consequatur atque aut numquam nemo et molestiae"
        }, .... ]
    },
    "message": "Success"
}


@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong while processing your credentials"
}

 */
router.get('/api/v1/books/:page/:perPage', books.getAll);

// Cart Details
/**
@api {get} /api/v1/users/:id/cart View Cart
@apiVersion 0.1.0
@apiName GetBooksInCart
@apiGroup Cart
@apiPermission user
@apiDescription This end point returns all the books in the cart for the provided user

@apiParam {String} id User's Unique id, need to be passed as part of the URL as a param.
@apiHeader {String} x-access-token Auth header with JWT Token
@apiHeader {String} x-key Auth header with the email address of the user

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Object[]}    data   The response from the server. An Array of books in user's cart
@apiSuccess {String}    data._id   Unique id of the book.
@apiSuccess {String}    data.title   title of the book.
@apiSuccess {String}    data.author   author of the book.
@apiSuccess {String}    data.author_image   image of the author.
@apiSuccess {String}    data.short_description   short description of the book.
@apiSuccess {Date}    data.release_date   release date of the book.
@apiSuccess {String}    data.image   image of the book cover.
@apiSuccess {String}    data.price   price of the book.
@apiSuccess {String}    data.rating   rating of the book.
@apiSuccess {String}    data.long_description   long description of the book with currency.
@apiSuccess {String}    data.qty   quantity.
@apiSuccess {String}     message          A message sent from the server.

@apiError (400 Bad Request) BadRequest If the request URL does not contain the id param
@apiError (401 Unauthorized) Unauthorized If the JWT authorization fails
@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl https://ionic-book-store.herokuapp.com/api/v1/users/5568596827fccbc16d60830b/cart --header "x-access-token:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzMxOTA1NDU3MzYsInVzZXIiOnsiX2lkIjoiNTU2Mzg0NzY5Mzc1ZDIwNjI2NDFiZTc5IiwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6ImEiLCJjYXJ0IjpbXSwicHVyY2hhc2VzIjpbXX19.tZ60eMRKHuRN7S4deuEgrdWl_0CoczmeTsQ-gkGVkJA" --header "x-key:a@a.com"

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
      "data": [
        {
            "_id": "55683cd8fbb2e1924f18a505",
            "title": "impedit aut odio",
            "author": "Russ Gusikowski",
            "author_image": "https://s3.amazonaws.com/uifaces/faces/twitter/homka/128.jpg",
            "release_date": "2015-05-28T21:28:42.941Z",
            "image": "http://lorempixel.com/640/480/abstract?_r=683574436767",
            "price": "241",
            "short_description": "et sit rem vel aut corrupti at cupiditate pariatur",
            "rating": 3,
            "long_description": "commodi omnis accusamus sint maxime\nvoluptatem velit hic\nea consequatur dignissimos molestias mollitia voluptatem adipisci a cumque\nsit ex excepturi quis possimus perspiciatis illum\net consequatur atque aut numquam nemo et molestiae",
            "qty" : 2
        }, .... ]
    },
    "message": "Success"
}


@apiExample Response (Bad Request):
 HTTP/1.1 400 Bad Request
{
    "error": "Invalid input",
    "data": null,
    "message": "Invalid input"
}

@apiExample Response (Unauthorized):
 HTTP/1.1 401 Unauthorized
{
    "error": "Invalid Token or Key",
    "data": null,
    "message": "Invalid Token or Key"
}

@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong"
}
 */
router.get('/api/v1/users/:id/cart', cart.viewCart);

/**
@api {post} /api/v1/users/:id/cart Add to cart
@apiVersion 0.1.0
@apiName AddToCart
@apiGroup Cart
@apiPermission user
@apiDescription This end point takes a book ID and quantity and adds to the provided user's cart

@apiParam {String} id User's Unique id, need to be passed as part of the URL as a param.
@apiParam {Object} book the book object, that needs to be added to the cart
@apiParam {String} book.id Book's Unique id, to be sent as body payload.
@apiParam {String} book.qty quantity, to be sent as body payload.

@apiHeader {String} x-access-token Auth header with JWT Token
@apiHeader {String} x-key Auth header with the email address of the user

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Object[]}    data   The response from the server. An Array of books in user's cart
@apiSuccess {String}    data.id   Unique id of the book.
@apiSuccess {String}    data.qty   Quantity.
@apiSuccess {String}     message          A message sent from the server.

@apiError (400 Bad Request) BadRequest If the request URL does not contain the id param or the body does not contain the book id & quantity
@apiError (401 Unauthorized) Unauthorized If the JWT authorization fails
@apiError (403 Forbidden) Forbidden If the user fetched from id in params is not defined
@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl --data "id=5563811fbf244b0d22b591e5&qty=2" https://ionic-book-store.herokuapp.com/api/v1/users/5568596827fccbc16d60830b/cart --header "x-access-token:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzMxOTA1NDU3MzYsInVzZXIiOnsiX2lkIjoiNTU2Mzg0NzY5Mzc1ZDIwNjI2NDFiZTc5IiwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6ImEiLCJjYXJ0IjpbXSwicHVyY2hhc2VzIjpbXX19.tZ60eMRKHuRN7S4deuEgrdWl_0CoczmeTsQ-gkGVkJA" --header "x-key:a@a.com"

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
      "data": [
        {
            "id": "5563811fbf244b0d22b591e5",
            "qty": 2
        }, ...],
    "message": "Success"
}


@apiExample Response (Bad Request):
 HTTP/1.1 400 Bad Request
{
    "error": "Invalid input",
    "data": null,
    "message": "Invalid input"
}

@apiExample Response (Unauthorized):
 HTTP/1.1 401 Unauthorized
{
    "error": "Invalid Token or Key",
    "data": null,
    "message": "Invalid Token or Key"
}

@apiExample Response (Forbidden):
 HTTP/1.1 403 Forbidden
{
    "error": "Invalid User",
    "data": null,
    "message": "Invalid User"
}

@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong while processing your credentials"
}
 */
router.post('/api/v1/users/:id/cart', cart.addToCart);

// Purchase Details
/**
@api {get} /api/v1/users/:id/purchases View Purchases
@apiVersion 0.1.0
@apiName GetPurchases
@apiGroup Purchases
@apiPermission user
@apiDescription This end point returns all the purchases a user has made

@apiParam {String} id User's Unique id, need to be passed as part of the param.
@apiHeader {String} x-access-token Auth header with JWT Token
@apiHeader {String} x-key Auth header with the email address of the user

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Object[]}    data   The response from the server. An Array of books in user's cart
@apiSuccess {String}    data._id   Unique id of the book.
@apiSuccess {String}    data.title   title of the book.
@apiSuccess {String}    data.author   author of the book.
@apiSuccess {String}    data.short_description   short description of the book.
@apiSuccess {Date}    data.release_date   release date of the book.
@apiSuccess {String}    data.image   image of the book cover.
@apiSuccess {String}    data.price   price of the book with currency.
@apiSuccess {String}    data.long_description   long description of the book with currency.
@apiSuccess {String}    data.qty   quantity.
@apiSuccess {String}     message          A message sent from the server.

@apiError (400 Bad Request) BadRequest If the request URL does not contain the id param
@apiError (401 Unauthorized) Unauthorized If the JWT authorization fails
@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl https://ionic-book-store.herokuapp.com/api/v1/users/5568596827fccbc16d60830b/purchases --header "x-access-token:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzMxOTA1NDU3MzYsInVzZXIiOnsiX2lkIjoiNTU2Mzg0NzY5Mzc1ZDIwNjI2NDFiZTc5IiwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6ImEiLCJjYXJ0IjpbXSwicHVyY2hhc2VzIjpbXX19.tZ60eMRKHuRN7S4deuEgrdWl_0CoczmeTsQ-gkGVkJA" --header "x-key:a@a.com"

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
      "data": [
        {
            "_id": "55683cd8fbb2e1924f18a505",
            "title": "impedit aut odio",
            "author": "Russ Gusikowski",
            "author_image": "https://s3.amazonaws.com/uifaces/faces/twitter/homka/128.jpg",
            "release_date": "2015-05-28T21:28:42.941Z",
            "image": "http://lorempixel.com/640/480/abstract?_r=683574436767",
            "price": "241",
            "short_description": "et sit rem vel aut corrupti at cupiditate pariatur",
            "rating": 3,
            "long_description": "commodi omnis accusamus sint maxime\nvoluptatem velit hic\nea consequatur dignissimos molestias mollitia voluptatem adipisci a cumque\nsit ex excepturi quis possimus perspiciatis illum\net consequatur atque aut numquam nemo et molestiae"
            "qty": "2"
        }, .... ]
    },
    "message": "Success"
}


@apiExample Response (Bad Request):
 HTTP/1.1 400 Bad Request
{
    "error": "Invalid input",
    "data": null,
    "message": "Invalid input"
}

@apiExample Response (Unauthorized):
 HTTP/1.1 401 Unauthorized
{
    "error": "Invalid Token or Key",
    "data": null,
    "message": "Invalid Token or Key"
}

@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong while processing your credentials"
}
 */
router.get('/api/v1/users/:id/purchases', purchase.viewPurchases);

/**
@api {post} /api/v1/users/:id/purchases Checkout Cart
@apiVersion 0.1.0
@apiName CheckoutCart
@apiGroup Purchases
@apiPermission user
@apiDescription This end point takes a array of objects that consist of all items added to the cart. 
This method adds the provided array of cart objects to purchases object on the user.

@apiParam {String} _id User's Unique id, need to be passed as part of the param.
@apiParam {Object[]} cart An array consisting of cart objects
@apiParam {String} cart.id Unique ID of the book
@apiParam {String} cart.qty Quantity
@apiSuccess {String}     message          A message sent from the server.


@apiHeader {String} x-access-token Auth header with JWT Token
@apiHeader {String} x-key Auth header with the email address of the user

@apiSuccess {Object}   error         The error object incase any.
@apiSuccess {Object[]}    data   The response from the server. An Array of books in user's cart
@apiSuccess {String}    data.id   Unique id of the book.
@apiSuccess {String}    data.qty   title of the book.
@apiSuccess {String}     message          A message sent from the server.

@apiError (400 Bad Request) BadRequest If the request URL does not contain the id param or the body does not contain an "Array" of book id & quantity objects
@apiError (401 Unauthorized) Unauthorized If the JWT authorization fails
@apiError (403 Forbidden) Forbidden If the user fetched from id in params is not defined
@apiError (500 Internal Server Error) InternalServerError The server encountered an internal error

@apiExample Example usage:
curl --data "item[id]5563811fbf244b0d22b591e5&item[qty]=2]" https://ionic-book-store.herokuapp.com/api/v1/users/5568596827fccbc16d60830b/purchases --header "x-access-token:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzMxOTA1NDU3MzYsInVzZXIiOnsiX2lkIjoiNTU2Mzg0NzY5Mzc1ZDIwNjI2NDFiZTc5IiwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6ImEiLCJjYXJ0IjpbXSwicHVyY2hhc2VzIjpbXX19.tZ60eMRKHuRN7S4deuEgrdWl_0CoczmeTsQ-gkGVkJA" --header "x-key:a@a.com"

@apiExample Response (success):
HTTP/1.1 200 OK
{
    "error": null,
      "data": [
        {
            "id": "5563811fbf244b0d22b591e5",
            "qty": 2
        }, ...],
    "message": "Success"
}


@apiExample Response (Bad Request):
 HTTP/1.1 400 Bad Request
{
    "error": "Invalid input",
    "data": null,
    "message": "Invalid input"
}

@apiExample Response (Unauthorized):
 HTTP/1.1 401 Unauthorized
{
    "error": "Invalid Token or Key",
    "data": null,
    "message": "Invalid Token or Key"
}

@apiExample Response (Forbidden):
 HTTP/1.1 403 Forbidden
{
    "error": "Invalid User",
    "data": null,
    "message": "Invalid User"
}

@apiExample Response (Internal Server Error):
 HTTP/1.1 500 Internal Server Error
{
    "error": {error : object},
    "data": null,
    "message": "Oops something went wrong while processing your credentials"
}
 */
router.post('/api/v1/users/:id/purchases', purchase.makePurchase);

module.exports = router;
