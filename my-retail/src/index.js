const express = require('express');
const expressGraphql = require('express-graphql');

const app = express();
const schema = require('./schema');

app.use(expressGraphql({
    schema,
    graphiql: true,
    pretty: true
}));

app.listen(5000);