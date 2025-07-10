import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { typeDefs } from '@graphql/schema/index.js';
import { resolvers } from '@graphql/resolvers/index.js';
import { initDB } from '@service/mongodb_service.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());


async function startApolloServer() {
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            Upload: GraphQLUpload,
            ...resolvers,
        },

    });

    await server.start();
    await initDB();

    app.use(
        '/',

        express.json(),
        graphqlUploadExpress(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res }),
        })
    );

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/`);
    });
}

startApolloServer();
