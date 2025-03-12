const pino = require('pino');

const transport = pino.transport({
    targets: [
        // {
        //     target: 'pino/file',
        //     options: { destination: logFilePath },
        // },
        {
            target: 'pino-pretty',
        },
    ],
});

module.exports = pino(transport);