import mongoose, { Document, Schema, Model } from 'mongoose';

interface IPriority {
    name: string;
    color: string;
    is_deleted: boolean
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
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

export const Priority:Model<IPriorityDocument> = mongoose.model<IPriorityDocument>('Priority', PrioritySchema);
