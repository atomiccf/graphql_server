import mongoose, { Document, Schema, Model } from 'mongoose';

interface IPriority {
    name: string;
    color: string;
}

export interface IPriorityDocument extends IPriority, Document {}

const PrioritySchema:Schema<IPriorityDocument> = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
});

export const Priority:Model<IPriorityDocument> = mongoose.model<IPriorityDocument>('Priority', PrioritySchema);
