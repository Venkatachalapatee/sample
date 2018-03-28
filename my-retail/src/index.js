const express = require('express');
const expressGraphql = require('express-graphql');

const app = express();
const schema = require('./schema');

// app.use(expressGraphql({
//     schema,
//     graphiql: false,
//     pretty: true
// }));
app.use('/graphql', expressGraphql({
    schema,
    graphiql: false,
    pretty: true,
    formatError: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path
    }),
}));
app.listen(5000);