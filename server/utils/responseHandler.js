module.exports = function(res, status, data, message, err) {

    var respObj = {
        error: err,
        data: data,
        message: message
    };

    res.status(status)
    return res.json(respObj);
}
