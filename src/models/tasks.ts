import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { Priority } from "@models/priority.js";
import {Status} from "@models/status.js";

interface ITask {
    title: string;
    description: string;
    is_completed: boolean;
    priority: Types.ObjectId;
    status: Types.ObjectId;
    image: string;
    publicUrl: string;
    is_deleted: boolean;
    _created_at: Date;
    _created_by: Types.ObjectId;
    _deleted_at: Date;
    _updated_at: Date;
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

    publicUrl: {
        type: String,
    },

    priority: {
        type: Schema.Types.ObjectId,
        ref: 'Priority',
        required: true
    },
    status: {
    type:Schema.Types.ObjectId,
    ref: 'Status',
    required: false,
    },
    is_deleted: { type: Boolean, default: false, required: true, },
    _created_at: {
        type: Date,
        required: true
    },
    _created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _deleted_at: {
        type: Date,
    },
    _updated_at: {
        type: Date,
    }
});

export const Task:Model<ITaskDocument> = mongoose.model<ITaskDocument>('Task', TaskSchema);
