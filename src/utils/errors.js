const errors = {
    general: [0, 500, 'Internal error'],
    invalidApiKey: [1, 401, 'Invalid API key'],
    invalidToken: [2, 401, 'Invalid token'],
    sqlError: [3, 500, 'SQL error'],
    notFound: [4, 404, 'Resource not found'],
    forbidden: [5, 403, 'Resource forbidden'],
    schemaError: [6, 500, 'Schema error'],
    invalidData: [7, 400, 'Invalid data provided'],
    unauthorized: [8, 401, 'Unauthorized access'],
    notCreated: [9, 404, 'Resource not created'],
    notUpdated: [10, 404, 'Resource not updated'],
    alreadyExists: [11, 409, 'Resource already exists'],
    invalidFilter: [12, 406, 'Unacceptable query filters'],
    notDeleted: [13, 404, 'Resource not deleted'],
    badRequest: [14, 400, 'Bad or non-sense request'],
    emailError: [15, 500, 'E-mail send error']
}

class AppError extends Error {
    constructor(error, message, dataDescription = null, data = null, critical = false) {
        if(data) {
            let dataDescriptionStr = '\nDebug data: ';
            let dataStr = '\n';

            for(let i = 0; i < data.length; i++) {
                dataDescriptionStr += `(${i + 1}) ${dataDescription[i]}, `;
                dataStr += `(${i + 1}) ${data[i]}\n`;
            }

            dataDescriptionStr = dataDescriptionStr.slice(0, dataDescriptionStr.length - 2);

            message += dataDescriptionStr + dataStr;
        }

        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = error[2];
        this.httpCode = error[1];
        this.appCode = error[0];
        this.critical = critical;

        Error.captureStackTrace(this);
    }
}

module.exports = { errors, AppError };