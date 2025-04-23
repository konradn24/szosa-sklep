const makeAddVerification = require("./add-verification");
const makeGetVerification = require("./get-verification");
const makeListVerifications = require("./list-verifications");
const makeUpdateVerification = require("./update-verification");
const makeRemoveVerification = require("./remove-verification");

const { verificationDb } = require("../../data-access");

const addVerification = makeAddVerification({ verificationDb });
const getVerification = makeGetVerification({ verificationDb });
const listVerifications = makeListVerifications({ verificationDb });
const updateVerification = makeUpdateVerification({ verificationDb });
const removeVerification = makeRemoveVerification({ verificationDb });

module.exports = { addVerification, getVerification, listVerifications, updateVerification, removeVerification };