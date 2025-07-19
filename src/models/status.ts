import mongoose, { Document, Schema, Model } from 'mongoose';

interface IStatus {
    name: string;
    color: string;
}

export interface IStatusDocument extends IStatus, Document {}

const StatusSchema:Schema<IStatusDocument> = new Schema({
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true }
});

export const Status:Model<IStatusDocument> = mongoose.model<IStatusDocument>('Status', StatusSchema);
