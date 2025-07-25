import mongoose, { Document, Schema, Model } from 'mongoose';

interface IStatus {
    name: string;
    color: string;
    is_deleted: boolean
}

export interface IStatusDocument extends IStatus, Document {}

const StatusSchema:Schema<IStatusDocument> = new Schema({
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    is_deleted: { type: Boolean, default: false }
});

export const Status:Model<IStatusDocument> = mongoose.model<IStatusDocument>('Status', StatusSchema);
