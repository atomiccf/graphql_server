import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    is_active: boolean;
    is_deleted: boolean;
    terms: boolean;
    _created_at: Date;
    _updated_at: Date;
    role: string;
}
export interface IUserDocument extends IUser, Document {}

const UserSchema:Schema<IUserDocument> = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
    terms: {
        type: Boolean,
        default: false,
        required: true
    },
    is_deleted: { type: Boolean, default: false, required: true, },
    _created_at: { type: Date, default: Date.now, required: true },
    _updated_at: Date,
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin'],
    }
});

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default User
