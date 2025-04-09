const { AppError, errors } = require("../utils/errors");

function checkAdminAccess(req, res, next) {
    if(!req.session.user) {
        return next(new AppError(errors.forbidden, "User not logged in.", null, null));
    }

    if(!req.session.user.admin) {
        return next(new AppError(errors.forbidden, "User is not an admin.", null, null));
    }

    return next();
}

module.exports = { checkAdminAccess };