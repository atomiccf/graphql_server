import mongoose from "mongoose";
import { getMongoUrl } from '@configuration/index.js'

export const initDB = async (): Promise<typeof mongoose> => {
    return await mongoose.connect(getMongoUrl());
}

