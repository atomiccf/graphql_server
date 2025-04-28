const express = require('express');
const {ApolloServer} = require('apollo-server')
const mongoService = require('./src/service/mongodb_service.js');
require('dotenv').config()
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');


app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use(cookieParser());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: {
      origin:'http://localhost:5173',
      credentials: true
    },
    context: ({ req, res }) => ({ req, res })
})



mongoService.init()

server.listen({port: PORT})
    .then((res) => {
        console.log(`Server is running on ${res.url}`);
    })

