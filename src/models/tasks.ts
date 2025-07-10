import mongoose, { Document, Schema, Model } from 'mongoose';

interface ITask {
    title: string;
    description: string;
    is_completed: boolean;
    priority: string;
    image: string;
    _created_at: Date;
    _created_by: string;
    _deleted_at: Date;
}

export interface ITaskDocument extends ITask, Document {}

const TaskSchema:Schema<ITaskDocument> = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    is_completed: {
        type: Boolean,
        default: false,
    },

    image: {
        type: String,
    },

    priority: {
        type: String,
        enum: ['low', 'extreme', 'moderate'],
        required: true
    },
    _created_at: {
        type: Date,
        required: true
    },
    _created_by: {
        type: String,
        required: true
    },
    _deleted_at: {
        type: Date,
    }
});

export const Task:Model<ITaskDocument> = mongoose.model<ITaskDocument>('Task', TaskSchema);
