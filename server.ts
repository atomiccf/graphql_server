import express from "express";
import type {Request, Response} from 'express';
import {ApolloServer} from 'apollo-server';
import { initDB } from "service/mongodb_service";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
import { typeDefs } from 'graphql/typeDefs';
import { resolvers } from 'graphql/resolvers';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;
const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

app.use(cookieParser());

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        },
        context: ({req, res}: { req: Request; res: Response }) => ({req, res})
    })


    await initDB()

    server.listen({port: PORT})
        .then((res) => {
            console.log(`Server is running on ${res.url}`);
    })
}

startServer()

