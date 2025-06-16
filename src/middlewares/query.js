function fetch(req, res, next) {
    res.locals.query = req.query;

    next();
}

module.exports = { fetch };