import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '@graphql/schema/index.js';
import { resolvers } from '@graphql/resolvers/index.js';
import { initDB } from '@service/mongodb_service.js';
import { fileURLToPath } from "url";
import { dirname } from "path";
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;

dotenv.config({ path: resolve(__dirname, '.env') });

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use('/storage', express.static(__dirname + '/mnt/storage'));


async function startApolloServer() {
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            Upload: GraphQLUpload,
            ...resolvers,
        },
        validationRules: [depthLimit(5)],
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

await startApolloServer();
