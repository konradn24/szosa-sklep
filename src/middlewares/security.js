const { AppError, errors } = require("../utils/errors");

function checkAdminAccess(req, res, next) {
    if(!req.session.user) {
        return res.redirect(`/?action=access&error=${errors.forbidden[0]}`);
    }

    if(!req.session.user.admin) {
        return res.redirect(`/?action=access&error=${errors.forbidden[0]}`);
    }

    return next();
}

module.exports = { checkAdminAccess };