const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    studentId: {
        type: String,
        required: function() { return this.role === 'student'; },
        unique: true
    },
    grade: {
        type: Number,
        required: function() { return this.role === 'student'; }
    },
    class: {
        type: String,
        required: function() { return this.role === 'student'; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
