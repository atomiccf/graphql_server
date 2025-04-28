"use strict"

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
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
    is_deleted: { type: Boolean, default: false, required: true, },
    _created_at: { type: Date, default: Date.now, required: true },
    _updated_at: Date,
    role: {
        type: String,
        enum: ['user', 'admin', 'super_admin'],
    }
});

module.exports = mongoose.model('User', userSchema);
