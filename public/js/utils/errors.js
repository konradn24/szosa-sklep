const errors = {
    general: 0,
    invalidApiKey: 1,
    invalidToken: 2,
    sqlError: 3,
    notFound: 4,
    forbidden: 5,
    schemaError: 6,
    invalidData: 7,
    unauthorized: 8,
    notCreated: 9,
    notUpdated: 10,
    alreadyExists: 11,
    invalidFilter: 12,
    notDeleted: 13,
    badRequest: 14,
    emailError: 15
}

const errorsPrompts = {
    0: 'Internal error',
    1: 'Invalid API key',
    2: 'Invalid token',
    3: 'SQL error',
    4: 'Resource not found',
    5: 'Resource forbidden',
    6: 'Schema error',
    7: 'Invalid data provided',
    8: 'Unauthorized access',
    9: 'Resource not created',
    10: 'Resource not updated',
    11: 'Resource already exists',
    12: 'Unacceptable query filters',
    13: 'Resource not deleted',
    14: 'Bad or non-sense request',
    15: 'E-mail send error'
}