import mongoose from "mongoose";
import { getMongoUrl } from 'configuration/index'

export const initDB = async (): Promise<typeof mongoose> => {
    return await mongoose.connect(getMongoUrl());
}

